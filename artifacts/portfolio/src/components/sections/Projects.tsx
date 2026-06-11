import { motion } from "framer-motion";
import { FolderKanban, Github, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTechIconComponent } from "@/lib/icons";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Projects() {
  const { data, isLoading } = usePortfolio();
  const projects = data.projects;
  const [filter, setFilter] = useState("All");
  const sectionTitles = data.settings.section_titles ?? {};

  const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags ?? [])))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.tags?.includes(filter));

  return (
    <section id="projects" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <FolderKanban className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.projects ?? "Featured Projects"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">ls -la ~/projects/automation/</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              data-testid={`filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${
                filter === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                layout
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 overflow-hidden ${project.borderColor ?? "hover:border-primary/30"}`}
                data-testid={`project-card-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${project.accentColor ?? "from-primary/20 to-transparent"}`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accentColor ?? "from-primary/10 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {(project.icons ?? []).map((iconName) => {
                        const Icon = getTechIconComponent(iconName);
                        return Icon ? <Icon key={iconName} className="w-7 h-7 text-muted-foreground" /> : null;
                      })}
                    </div>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`github-link-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono border border-border hover:border-primary/40 px-2 py-1 rounded-md"
                      >
                        <Github className="w-3.5 h-3.5" />
                        View Code
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-lg font-bold font-mono mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {(project.stack ?? []).map((s) => (
                      <span key={s} className="px-2 py-0.5 text-xs font-mono rounded bg-background/70 border border-border/60 text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
