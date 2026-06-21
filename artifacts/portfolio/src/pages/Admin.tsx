import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { toast, Toaster } from "sonner";
import {
  LayoutDashboard, Briefcase, Code2, FolderKanban, Link2,
  User, GraduationCap, HeartPulse, Github, LogOut, ExternalLink,
  Plus, Pencil, Trash2, Loader2, Activity, Mail, Type, KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { TagInput } from "@/components/admin/TagInput";
import { useSettings } from "@/components/admin/useSettings";
import { Field, ResourceHeader, AdminSkeleton, EmptyState, PanelCard } from "@/components/admin/admin-ui";
import { api, clearAdminToken, hasAdminToken, setAdminToken } from "@/lib/api";
import { detectSocialIcon, SOCIAL_ICON_OPTIONS, getSocialIconComponent } from "@/lib/icons";
import { initialsFromName, getSkillCategoryStyle } from "@/lib/transformPortfolio";
import type {
  Experience, SkillCategory, Project, SocialLink,
  Certification, HealthcareProduct, ProgressBar, CommandCenterSettings,
} from "@/lib/types";

type Section =
  | "profile"
  | "ops"
  | "experiences"
  | "skills"
  | "projects"
  | "socials"
  | "github"
  | "healthcare"
  | "education"
  | "section_titles"
  | "inbox"
  | "account";

const NAV: { id: Section; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ops", label: "Ops Center", icon: Activity },
  { id: "experiences", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Technical Arsenal", icon: Code2 },
  { id: "projects", label: "Featured Projects", icon: FolderKanban },
  { id: "socials", label: "Social Links", icon: Link2 },
  { id: "github", label: "GitHub", icon: Github },
  { id: "healthcare", label: "Healthcare", icon: HeartPulse },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "section_titles", label: "Section Titles", icon: Type },
  { id: "inbox", label: "Inbox", icon: Mail },
  { id: "account", label: "Account", icon: KeyRound },
];

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(hasAdminToken());
  const [section, setSection] = useState<Section>("profile");
  const queryClient = useQueryClient();

  function handleLogout() {
    clearAdminToken();
    setAuthenticated(false);
  }

  function invalidatePortfolio() {
    queryClient.invalidateQueries({ queryKey: ["portfolio"] });
  }

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card/30 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-sm">Portfolio Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
                section === id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Button variant="outline" size="sm" className="w-full font-mono" asChild>
            <Link href="/"><ExternalLink className="w-4 h-4 mr-2" /> View Site</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full font-mono" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border px-6 py-4 bg-card/20">
          <h1 className="font-mono font-bold">{NAV.find((n) => n.id === section)?.label}</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {section === "profile" && <ProfilePanel onSave={invalidatePortfolio} />}
          {section === "ops" && <OpsPanel onSave={invalidatePortfolio} />}
          {section === "experiences" && <ExperiencesPanel onSave={invalidatePortfolio} />}
          {section === "skills" && <SkillsPanel onSave={invalidatePortfolio} />}
          {section === "projects" && <ProjectsPanel onSave={invalidatePortfolio} />}
          {section === "socials" && <SocialsPanel onSave={invalidatePortfolio} />}
          {section === "github" && <GitHubPanel onSave={invalidatePortfolio} />}
          {section === "healthcare" && <HealthcarePanel onSave={invalidatePortfolio} />}
          {section === "education" && <EducationPanel onSave={invalidatePortfolio} />}
          {section === "section_titles" && <SectionTitlesPanel onSave={invalidatePortfolio} />}
          {section === "inbox" && <InboxPanel />}
          {section === "account" && <AccountPanel onLogin={() => setAuthenticated(true)} />}
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

function ProfilePanel({ onSave }: { onSave: () => void }) {
  const { settings, loading, saveSetting } = useSettings();
  const [hero, setHero] = useState(settings.hero ?? {});
  const [about, setAbout] = useState(settings.about ?? {});
  const [footer, setFooter] = useState(settings.footer ?? {});
  const [contactIntro, setContactIntro] = useState(settings.contact_intro ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHero(settings.hero ?? {});
    setAbout(settings.about ?? {});
    setFooter(settings.footer ?? {});
    setContactIntro(settings.contact_intro ?? "");
  }, [settings]);

  function updateName(name: string) {
    setHero({ ...hero, name, initials: initialsFromName(name) });
    setFooter({ ...footer, copyrightName: name });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        saveSetting("hero", hero),
        saveSetting("about", about),
        saveSetting("footer", footer),
        saveSetting("contact_intro", contactIntro),
      ]);
      toast.success("Profile saved");
      onSave();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <PanelCard title="Profile & About" description="Name, role, profile image, and about content">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" value={hero.name ?? ""} onChange={updateName} />
            <Field label="Role / Title" value={hero.title ?? ""} onChange={(v) => setHero({ ...hero, title: v })} />
            <Field label="Badge" value={hero.badge ?? ""} onChange={(v) => setHero({ ...hero, badge: v })} />
            <Field label="Location" value={hero.location ?? ""} onChange={(v) => setHero({ ...hero, location: v })} />
            <Field label="Resume URL" value={hero.resumeUrl ?? ""} onChange={(v) => setHero({ ...hero, resumeUrl: v })} />
            <Field label="Profile Image URL" value={hero.profileImageUrl ?? ""} onChange={(v) => setHero({ ...hero, profileImageUrl: v })} placeholder="https://..." />
          </div>
          {hero.profileImageUrl && (
            <div className="flex items-center gap-4">
              <img src={hero.profileImageUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-border" />
              <p className="text-xs text-muted-foreground font-mono">Profile image preview</p>
            </div>
          )}
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Tagline</Label>
            <Input value={hero.tagline ?? ""} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">About / Summary</Label>
            <Textarea rows={5} value={about.content ?? ""} onChange={(e) => setAbout({ content: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Contact Intro</Label>
            <Textarea rows={2} value={contactIntro} onChange={(e) => setContactIntro(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Footer Tagline" value={footer.tagline ?? ""} onChange={(v) => setFooter({ ...footer, tagline: v })} />
            <Field label="Copyright Name" value={footer.copyrightName ?? ""} onChange={(v) => setFooter({ ...footer, copyrightName: v })} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="font-mono">{saving ? "Saving..." : "Save Profile"}</Button>
        </CardContent>
      </Card>
    </PanelCard>
  );
}

function OpsPanel({ onSave }: { onSave: () => void }) {
  const { settings, loading, saveSetting } = useSettings();
  const [config, setConfig] = useState<CommandCenterSettings>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setConfig(settings.command_center ?? {}); }, [settings.command_center]);

  function updateKpi(index: number, field: "value" | "label", val: string) {
    const kpis = [...(config.kpis ?? [])];
    while (kpis.length <= index) kpis.push({ value: "", label: "" });
    kpis[index] = { ...kpis[index], [field]: val };
    setConfig({ ...config, kpis });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSetting("command_center", config);
      toast.success("Ops Center saved");
      onSave();
    } finally { setSaving(false); }
  }

  if (loading) return <AdminSkeleton />;

  const quality = config.quality ?? { score: 98, automationCoverage: 75, deploymentReadiness: "HIGH", defectLeakage: "LOW" };
  const coverage = config.coverage ?? { automated: 75, manual: 25 };

  return (
    <PanelCard title="QA Operations Center" description="KPI metrics and quality scores shown on the homepage">
      <Card><CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(config.kpis ?? []).map((kpi, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-border">
              <Field label="KPI Value" value={kpi.value} onChange={(v) => updateKpi(i, "value", v)} />
              <Field label="KPI Label" value={kpi.label} onChange={(v) => updateKpi(i, "label", v)} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Quality Score %" value={String(quality.score)} onChange={(v) => setConfig({ ...config, quality: { ...quality, score: Number(v) || 0 } })} />
          <Field label="Automation %" value={String(quality.automationCoverage)} onChange={(v) => setConfig({ ...config, quality: { ...quality, automationCoverage: Number(v) || 0 }, coverage: { automated: Number(v) || 0, manual: 100 - (Number(v) || 0) } })} />
          <Field label="Deployment Readiness" value={quality.deploymentReadiness} onChange={(v) => setConfig({ ...config, quality: { ...quality, deploymentReadiness: v } })} />
          <Field label="Defect Leakage" value={quality.defectLeakage} onChange={(v) => setConfig({ ...config, quality: { ...quality, defectLeakage: v } })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Coverage Automated %" value={String(coverage.automated)} onChange={(v) => setConfig({ ...config, coverage: { automated: Number(v) || 0, manual: 100 - (Number(v) || 0) } })} />
          <Field label="Coverage Manual %" value={String(coverage.manual)} onChange={(v) => setConfig({ ...config, coverage: { manual: Number(v) || 0, automated: 100 - (Number(v) || 0) } })} />
        </div>
        <TagInput
          label="Live Test Log Titles"
          values={(config.logs ?? []).map((l) => l.title)}
          onChange={(titles) => setConfig({
            ...config,
            logs: titles.map((title) => ({ status: "pass" as const, title, type: "API" })),
          })}
        />
        <Button onClick={handleSave} disabled={saving} className="font-mono">{saving ? "Saving..." : "Save Ops Center"}</Button>
      </CardContent></Card>
    </PanelCard>
  );
}

function ExperiencesPanel({ onSave }: { onSave: () => void }) {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<Experience>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getExperiences()); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) await api.updateExperience(editId, form);
      else await api.createExperience(form);
      toast.success("Experience saved");
      setDialogOpen(false);
      load();
      onSave();
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteExperience(deleteId);
      setDeleteId(null);
      load();
      onSave();
    } finally { setDeleting(false); }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <>
      <ResourceHeader title="Work Experience" onAdd={() => { setForm({ title: "", company: "", period: "", current: false, highlights: [], tags: [] }); setEditId(null); setDialogOpen(true); }} />
      {items.length === 0 && <EmptyState message="No experiences yet." />}
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item._id}><CardContent className="pt-6 flex justify-between">
            <div><h3 className="font-mono font-bold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.company} · {item.period}</p></div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setForm({ ...item }); setEditId(item._id); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteId(item._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-mono">{editId ? "Edit" : "Add"} Experience</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Role / Title" value={form.title ?? ""} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="Company" value={form.company ?? ""} onChange={(v) => setForm({ ...form, company: v })} />
            <Field label="Duration" value={form.period ?? ""} onChange={(v) => setForm({ ...form, period: v })} />
            <div className="flex items-center gap-2"><Switch checked={form.current ?? false} onCheckedChange={(v) => setForm({ ...form, current: v })} /><Label>Current position</Label></div>
            <TagInput label="Responsibilities" values={form.highlights ?? []} onChange={(v) => setForm({ ...form, highlights: v })} />
            <TagInput label="Tags" values={form.tags ?? []} onChange={(v) => setForm({ ...form, tags: v })} />
          </div>
          <DialogFooter><Button onClick={handleSave} disabled={saving}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Experience" description="Delete this experience entry?" onConfirm={handleDelete} loading={deleting} />
    </>
  );
}

function SkillsPanel({ onSave }: { onSave: () => void }) {
  const [items, setItems] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<SkillCategory>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { settings, loading: settingsLoading, saveSetting } = useSettings();
  const [progressBars, setProgressBars] = useState<ProgressBar[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getSkills()); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setProgressBars(settings.progress_bars ?? []); }, [settings.progress_bars]);

  async function handleSave() {
    setSaving(true);
    const style = getSkillCategoryStyle(form.name ?? "");
    const payload = { ...form, color: style.color, bg: style.bg, icons: style.icons };
    try {
      if (editId) await api.updateSkill(editId, payload);
      else await api.createSkill(payload);
      toast.success("Skill category saved");
      setDialogOpen(false);
      load();
      onSave();
    } finally { setSaving(false); }
  }

  async function saveProgress() {
    await saveSetting("progress_bars", progressBars);
    await saveSetting("radar_data", progressBars.map((p) => ({ subject: p.label.replace(" Testing", "").replace("Test ", ""), A: p.pct })));
    toast.success("Skill estimates saved");
    onSave();
  }

  if (loading || settingsLoading) return <AdminSkeleton />;

  return (
    <>
      <ResourceHeader title="Technical Arsenal" onAdd={() => { setForm({ name: "", skills: [] }); setEditId(null); setDialogOpen(true); }} />
      {items.length === 0 && <EmptyState message="No skill categories yet." />}
      <div className="grid gap-4 mb-8">
        {items.map((item) => (
          <Card key={item._id}><CardContent className="pt-6 flex justify-between">
            <div><h3 className={`font-mono font-bold ${item.color}`}>{item.name}</h3><p className="text-xs text-muted-foreground mt-1">{(item.skills ?? []).join(", ")}</p></div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setForm({ ...item }); setEditId(item._id); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteId(item._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <h3 className="font-mono font-semibold text-sm">Skill Radar Estimates</h3>
        {progressBars.map((bar, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <Field label="Skill" value={bar.label} onChange={(v) => { const next = [...progressBars]; next[i] = { ...bar, label: v }; setProgressBars(next); }} />
            <Field label="Percentage" value={String(bar.pct)} onChange={(v) => { const next = [...progressBars]; next[i] = { ...bar, pct: Number(v) || 0 }; setProgressBars(next); }} />
          </div>
        ))}
        <Button onClick={saveProgress} className="font-mono">Save Skill Estimates</Button>
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-mono">{editId ? "Edit" : "Add"} Category</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Category Name" value={form.name ?? ""} onChange={(v) => setForm({ ...form, name: v })} />
            <TagInput label="Skills" values={form.skills ?? []} onChange={(v) => setForm({ ...form, skills: v })} />
          </div>
          <DialogFooter><Button onClick={handleSave} disabled={saving}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Category" description="Delete this skill category?" onConfirm={async () => { if (!deleteId) return; setDeleting(true); try { await api.deleteSkill(deleteId); setDeleteId(null); load(); onSave(); } finally { setDeleting(false); } }} loading={deleting} />
    </>
  );
}

function ProjectsPanel({ onSave }: { onSave: () => void }) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<Project>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); try { setItems(await api.getProjects()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <AdminSkeleton />;

  return (
    <>
      <ResourceHeader title="Featured Projects" onAdd={() => { setForm({ title: "", description: "", stack: [], tags: [] }); setEditId(null); setDialogOpen(true); }} />
      {items.length === 0 && <EmptyState message="No projects yet." />}
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item._id}><CardContent className="pt-6 flex justify-between">
            <div><h3 className="font-mono font-bold">{item.title}</h3><p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p></div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setForm({ ...item }); setEditId(item._id); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteId(item._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-mono">{editId ? "Edit" : "Add"} Project</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Project Name" value={form.title ?? ""} onChange={(v) => setForm({ ...form, title: v })} />
            <div className="space-y-2"><Label className="font-mono text-xs uppercase">Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <Field label="GitHub URL" value={form.github ?? ""} onChange={(v) => setForm({ ...form, github: v })} />
            <Field label="Live URL" value={form.live ?? ""} onChange={(v) => setForm({ ...form, live: v })} />
            <TagInput label="Technologies" values={form.stack ?? []} onChange={(v) => setForm({ ...form, stack: v })} />
            <TagInput label="Tags" values={form.tags ?? []} onChange={(v) => setForm({ ...form, tags: v })} />
          </div>
          <DialogFooter><Button onClick={async () => { setSaving(true); try { if (editId) await api.updateProject(editId, form); else await api.createProject(form); setDialogOpen(false); load(); onSave(); } finally { setSaving(false); } }} disabled={saving}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Project" description="Delete this project?" onConfirm={async () => { if (!deleteId) return; setDeleting(true); try { await api.deleteProject(deleteId); setDeleteId(null); load(); onSave(); } finally { setDeleting(false); } }} loading={deleting} />
    </>
  );
}

function SocialsPanel({ onSave }: { onSave: () => void }) {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<SocialLink>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); try { setItems(await api.getSocials()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  function detectIcon(url: string, platform: string) {
    setForm((f) => ({ ...f, icon: detectSocialIcon(url, platform) }));
  }

  if (loading) return <AdminSkeleton />;

  return (
    <>
      <ResourceHeader title="Social Links" onAdd={() => { setForm({ platform: "", url: "", icon: "globe", label: "" }); setEditId(null); setDialogOpen(true); }} />
      {items.length === 0 && <EmptyState message="No social links yet." />}
      <div className="grid gap-4">
        {items.map((item) => {
          const Icon = getSocialIconComponent(item.icon ?? "globe");
          return (
            <Card key={item._id}><CardContent className="pt-6 flex justify-between">
              <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Icon className="w-5 h-5 text-primary" /></div><div><h3 className="font-mono font-bold">{item.platform}</h3><p className="text-sm text-muted-foreground">{item.label ?? item.url}</p></div></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setForm({ ...item }); setEditId(item._id); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteId(item._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent></Card>
          );
        })}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-mono">{editId ? "Edit" : "Add"} Social Link</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Platform" value={form.platform ?? ""} onChange={(v) => { setForm({ ...form, platform: v }); detectIcon(form.url ?? "", v); }} />
            <Field label="URL" value={form.url ?? ""} onChange={(v) => { setForm({ ...form, url: v }); detectIcon(v, form.platform ?? ""); }} />
            <Field label="Display Label" value={form.label ?? ""} onChange={(v) => setForm({ ...form, label: v })} />
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase">Icon</Label>
              <Select value={form.icon ?? "globe"} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SOCIAL_ICON_OPTIONS.map(({ value, label, Icon }) => (<SelectItem key={value} value={value}><span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span></SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={async () => { setSaving(true); try { if (editId) await api.updateSocial(editId, form); else await api.createSocial(form); setDialogOpen(false); load(); onSave(); } finally { setSaving(false); } }} disabled={saving}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Social Link" description="Delete this link?" onConfirm={async () => { if (!deleteId) return; setDeleting(true); try { await api.deleteSocial(deleteId); setDeleteId(null); load(); onSave(); } finally { setDeleting(false); } }} loading={deleting} />
    </>
  );
}

function GitHubPanel({ onSave }: { onSave: () => void }) {
  const { settings, loading, saveSetting } = useSettings();
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (settings.github_username) setUsername(settings.github_username); }, [settings.github_username]);
  if (loading) return <AdminSkeleton />;
  return (
    <PanelCard title="GitHub" description="Contribution chart via ghchart.rshah.org">
      <Card><CardContent className="pt-6 space-y-4">
        <Field label="GitHub Username" value={username} onChange={setUsername} />
        <img src={`https://ghchart.rshah.org/${username || "github"}`} alt="Chart" className="w-full rounded border border-border" />
        <Button onClick={async () => { setSaving(true); try { await saveSetting("github_username", username); toast.success("Saved"); onSave(); } finally { setSaving(false); } }} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </CardContent></Card>
    </PanelCard>
  );
}

function HealthcarePanel({ onSave }: { onSave: () => void }) {
  const { settings, loading, saveSetting } = useSettings();
  const [products, setProducts] = useState<HealthcareProduct[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<HealthcareProduct>({ name: "", description: "", features: [] });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setProducts(settings.healthcare_products ?? []); }, [settings.healthcare_products]);

  async function persist(list: HealthcareProduct[]) {
    setSaving(true);
    try { await saveSetting("healthcare_products", list); setProducts(list); toast.success("Healthcare saved"); onSave(); } finally { setSaving(false); }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <>
      <ResourceHeader title="Healthcare Systems" onAdd={() => { setForm({ name: "", badge: "", description: "", features: [] }); setEditIndex(null); setDialogOpen(true); }} />
      <div className="grid gap-4">
        {products.map((item, i) => (
          <Card key={i}><CardContent className="pt-6 flex justify-between">
            <div><h3 className="font-mono font-bold">{item.name}</h3><p className="text-xs text-primary">{item.badge}</p><p className="text-sm text-muted-foreground mt-1">{item.description}</p></div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setForm(item); setEditIndex(i); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => persist(products.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-mono">{editIndex !== null ? "Edit" : "Add"} Healthcare System</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Context / Badge" value={form.badge ?? ""} onChange={(v) => setForm({ ...form, badge: v })} />
            <div className="space-y-2"><Label className="font-mono text-xs uppercase">Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <TagInput label="Features" values={form.features ?? []} onChange={(v) => setForm({ ...form, features: v })} />
            <TagInput label="Clients (optional)" values={form.clients ?? []} onChange={(v) => setForm({ ...form, clients: v })} />
          </div>
          <DialogFooter><Button onClick={() => { const next = [...products]; if (editIndex !== null) next[editIndex] = form; else next.push(form); persist(next); setDialogOpen(false); }} disabled={saving}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EducationPanel({ onSave }: { onSave: () => void }) {
  const { settings, loading, saveSetting } = useSettings();
  const [education, setEducation] = useState(settings.education ?? {});
  const [certs, setCerts] = useState<Certification[]>([]);
  const [certDialog, setCertDialog] = useState(false);
  const [certForm, setCertForm] = useState<Certification>({ title: "", areas: [] });
  const [certEditIndex, setCertEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEducation(settings.education ?? {});
    setCerts(settings.certifications ?? []);
  }, [settings.education, settings.certifications]);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSetting("education", education);
      await saveSetting("certifications", certs);
      toast.success("Education saved");
      onSave();
    } finally { setSaving(false); }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <PanelCard title="Education & Certifications">
      <Card><CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Institution" value={education.university ?? ""} onChange={(v) => setEducation({ ...education, university: v })} />
          <Field label="Degree" value={education.degree ?? ""} onChange={(v) => setEducation({ ...education, degree: v })} />
          <Field label="GPA / CGPA" value={education.cgpa ?? ""} onChange={(v) => setEducation({ ...education, cgpa: v })} />
          <Field label="Research" value={education.research ?? ""} onChange={(v) => setEducation({ ...education, research: v })} />
        </div>
        <ResourceHeader title="Certifications" onAdd={() => { setCertForm({ title: "", subtitle: "", areas: [] }); setCertEditIndex(null); setCertDialog(true); }} />
        <div className="grid gap-3">
          {certs.map((cert, i) => (
            <Card key={i}><CardContent className="pt-4 flex justify-between">
              <div><h4 className="font-mono font-bold text-sm">{cert.title}</h4><p className="text-xs text-muted-foreground">{cert.subtitle}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setCertForm(cert); setCertEditIndex(i); setCertDialog(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setCerts(certs.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
        <Button onClick={handleSave} disabled={saving} className="font-mono">{saving ? "Saving..." : "Save Education"}</Button>
      </CardContent></Card>
      <Dialog open={certDialog} onOpenChange={setCertDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-mono">{certEditIndex !== null ? "Edit" : "Add"} Certification</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Name" value={certForm.title} onChange={(v) => setCertForm({ ...certForm, title: v })} />
            <Field label="Provider" value={certForm.subtitle ?? ""} onChange={(v) => setCertForm({ ...certForm, subtitle: v })} />
            <TagInput label="Topics" values={certForm.areas ?? []} onChange={(v) => setCertForm({ ...certForm, areas: v })} />
          </div>
          <DialogFooter><Button onClick={() => { const next = [...certs]; if (certEditIndex !== null) next[certEditIndex] = certForm; else next.push(certForm); setCerts(next); setCertDialog(false); }}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PanelCard>
  );
}

function AccountPanel({ onLogin }: { onLogin: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (!newUsername && !newPassword) {
      toast.error("Enter a new username and/or password");
      return;
    }

    setSaving(true);
    try {
      const res = await api.changeCredentials({
        currentPassword,
        newUsername: newUsername || undefined,
        newPassword: newPassword || undefined,
      });
      setAdminToken(res.token);
      toast.success(res.message ?? "Credentials updated");
      setCurrentPassword("");
      setNewUsername("");
      setNewPassword("");
      setConfirmPassword("");
      onLogin();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelCard title="Account Settings" description="Change your admin username or password">
      <Card>
        <CardContent className="pt-6 space-y-4 max-w-md">
          <Field label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" />
          <Field label="New Username (optional)" value={newUsername} onChange={setNewUsername} />
          <Field label="New Password (optional)" value={newPassword} onChange={setNewPassword} type="password" />
          <Field label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
          <p className="text-xs text-muted-foreground font-mono">
            Default first-time login: username <strong>admin</strong>, password <strong>admin</strong>
          </p>
          <Button onClick={handleSave} disabled={saving} className="font-mono">
            {saving ? "Updating..." : "Update Credentials"}
          </Button>
        </CardContent>
      </Card>
    </PanelCard>
  );
}

function SectionTitlesPanel({ onSave }: { onSave: () => void }) {
  const { settings, loading, saveSetting } = useSettings();
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitles(settings.section_titles ?? {});
  }, [settings]);

  const updateTitle = (key: string, value: string) => {
    setTitles((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSave() {
    setSaving(true);
    try {
      await saveSetting("section_titles", titles);
      toast.success("Section titles updated");
      onSave();
    } catch {
      toast.error("Failed to save section titles");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <PanelCard title="Section Titles" description="Customize the displayed names of all sections on the frontend">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="About Section" value={titles.about ?? "About Me"} onChange={(v) => updateTitle("about", v)} />
            <Field label="Experience Section" value={titles.experience ?? "Experience"} onChange={(v) => updateTitle("experience", v)} />
            <Field label="Skills Section" value={titles.skills ?? "Technical Arsenal"} onChange={(v) => updateTitle("skills", v)} />
            <Field label="Projects Section" value={titles.projects ?? "Featured Projects"} onChange={(v) => updateTitle("projects", v)} />
            <Field label="Healthcare Section" value={titles.healthcare ?? "Healthcare Systems Tested"} onChange={(v) => updateTitle("healthcare", v)} />
            <Field label="Education Section" value={titles.education ?? "Education & Certifications"} onChange={(v) => updateTitle("education", v)} />
            <Field label="GitHub Section" value={titles.github ?? "GitHub Activity"} onChange={(v) => updateTitle("github", v)} />
            <Field label="Command Center Section" value={titles.command_center ?? "QA Operations Center"} onChange={(v) => updateTitle("command_center", v)} />
            <Field label="Contact Section" value={titles.contact ?? "Get in Touch"} onChange={(v) => updateTitle("contact", v)} />
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="font-mono">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </PanelCard>
  );
}

interface InboxMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

function InboxPanel() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.getInboxMessages();
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function handleDeleteConfirm() {
    if (!selectedMsgId) return;
    setDeleting(true);
    try {
      await api.deleteInboxMessage(selectedMsgId);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== selectedMsgId));
      setDeleteConfirmOpen(false);
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
      setSelectedMsgId(null);
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <>
      <PanelCard title="Inbox Messages" description="View and manage messages sent from your contact form">
        {messages.length === 0 ? (
          <EmptyState message="No messages submitted via the contact form yet." />
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg._id} className="border-border bg-card/40 hover:bg-card/60 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h3 className="font-mono font-bold text-foreground">{msg.subject}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="font-semibold text-primary">{msg.name}</span>
                        <span>&lt;{msg.email}&gt;</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedMsgId(msg._id);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap font-sans bg-background/50 border border-border/50 rounded-lg p-3">
                    {msg.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PanelCard>
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete message?"
        description="This message will be permanently removed from your inbox."
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}
