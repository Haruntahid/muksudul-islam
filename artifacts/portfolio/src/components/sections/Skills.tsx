import { motion } from "framer-motion";
import { useState } from "react";
import { Code2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { usePortfolio } from "@/context/PortfolioContext";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Skills() {
  const { data, isLoading } = usePortfolio();
  const categories = data.skills;
  const radarData = data.settings.radar_data ?? [];
  const progressBars = data.settings.progress_bars ?? [];
  const [active, setActive] = useState<string | null>(null);
  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="skills" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Code2 className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.skills ?? "Technical Arsenal"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">skills --list --categorized</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {categories.map((cat) => (
                  <motion.div
                    key={cat._id}
                    variants={item}
                    onClick={() => setActive(active === cat.name ? null : cat.name)}
                    data-testid={`skill-card-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`rounded-xl border p-5 cursor-pointer transition-all duration-300 ${cat.bg ?? "bg-card/40"} hover:scale-[1.02] ${active === cat.name ? "ring-2 ring-primary/30 scale-[1.02]" : ""}`}
                  >
                    <div className={`text-xs font-mono font-bold uppercase tracking-widest mb-3 ${cat.color ?? "text-primary"}`}>
                      {cat.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(cat.skills ?? []).map((s) => (
                        <span key={s} className="px-2 py-1 text-xs rounded-md bg-background/60 border border-border/50 font-mono text-foreground/80">
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 flex flex-col"
          >
            <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Skill Radar</h3>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="flex-1 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono, monospace" }} />
                    <Radar name="Skills" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {progressBars.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
