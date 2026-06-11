import { motion } from "framer-motion";
import { Github, Star, GitFork, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
}

interface GHUser {
  public_repos: number;
  followers: number;
  following: number;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function GitHubSection() {
  const { data } = usePortfolio();
  const username = data.settings.github_username ?? "MuksudulIslam";
  const [repos, setRepos] = useState<Repo[]>([]);
  const [user, setUser] = useState<GHUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sectionTitles = data.settings.section_titles ?? {};

  useEffect(() => {
    setLoading(true);
    setError(false);
    async function fetchData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");
        const [userData, reposData] = await Promise.all([userRes.json(), reposRes.json()]);
        setUser(userData);
        setRepos(reposData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  return (
    <section id="github" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Github className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.github ?? "GitHub Activity"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">gh repo list {username} --limit 6</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : error ? null : (
            <>
              <StatCard label="Repositories" value={`${user?.public_repos ?? 0}`} />
              <StatCard label="Followers" value={`${user?.followers ?? 0}`} />
              <StatCard label="Following" value={`${user?.following ?? 0}`} />
              <StatCard label="Recent Repos" value={`${repos.length}`} />
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 mb-8"
        >
          <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contribution Graph</h3>
          <ContributionChart username={username} />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground font-mono">Less</span>
            <div className="flex items-center gap-1">
              {["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/70", "bg-primary"].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-mono">More</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
            : error
            ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground font-mono">
                GitHub API rate limit reached. Visit{" "}
                <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="text-primary underline">
                  github.com/{username}
                </a>
              </div>
            )
            : repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                data-testid={`repo-card-${repo.name}`}
                className="group rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-mono font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {repo.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                  {repo.description ?? "No description provided."}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#8b949e" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {repo.forks_count}
                  </span>
                  <span className="ml-auto">{timeAgo(repo.updated_at)}</span>
                </div>
              </motion.a>
            ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 text-center"
    >
      <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-mono">{label}</div>
    </motion.div>
  );
}

function ContributionChart({ username }: { username: string }) {
  const chartUrl = `https://ghchart.rshah.org/${username}`;

  return (
    <div className="overflow-x-auto">
      <img
        src={chartUrl}
        alt={`GitHub contribution chart for ${username}`}
        className="w-full min-w-[600px] rounded-lg"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
