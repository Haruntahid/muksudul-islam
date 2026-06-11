import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Experience() {
  const { data, isLoading } = usePortfolio();
  const jobs = data.experiences;
  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="experience" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.experience ?? "Experience"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">git log --career --oneline</p>
        </motion.div>

        {isLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />

            <div className="space-y-10">
              {jobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    {job.current ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                      </span>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-muted" />
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors group">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                      </div>
                      {job.period && (
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {job.period}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 mb-4">
                      {(job.highlights ?? []).map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {(job.tags ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                        {job.tags!.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
