import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";

function renderAboutContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function About() {
  const { data, isLoading } = usePortfolio();
  const about = data.settings.about;
  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card/30 backdrop-blur-xl p-8 md:p-12 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-3 mb-6 text-primary">
              <Terminal className="w-6 h-6" />
              <span className="font-mono tracking-wider uppercase text-sm">
                System.out.println("{sectionTitles.about ?? "About Me"}");
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground relative z-10">
                {renderAboutContent(about?.content ?? "")}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
