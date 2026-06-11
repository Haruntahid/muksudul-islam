import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Education() {
  const { data, isLoading } = usePortfolio();
  const education = data.settings.education;
  const certifications = data.settings.certifications ?? [];
  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="education" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.education ?? "Education & Certifications"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">cat credentials.json | jq .</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-7 relative overflow-hidden group hover:border-primary/30 transition-colors"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Education</span>
                </div>

                <h3 className="text-xl font-bold font-mono mb-1 group-hover:text-primary transition-colors">
                  {education?.university}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{education?.degree}</p>

                {education?.cgpa && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono font-bold">
                      CGPA: {education.cgpa}
                    </div>
                  </div>
                )}

                {education?.research && (
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-mono">Research</p>
                        <p className="text-sm text-foreground">{education.research}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`cert-card-${cert.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`group rounded-xl border bg-card/40 backdrop-blur-sm p-6 relative overflow-hidden transition-colors ${cert.color ?? "border-border"}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cert.accent ?? "from-primary/5"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-muted border border-border">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold font-mono text-sm leading-tight">{cert.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{cert.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(cert.areas ?? []).map((a) => (
                        <span key={a} className={`px-2 py-0.5 text-xs font-mono rounded-full ${cert.badgeBg ?? "bg-primary/10 text-primary"}`}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
