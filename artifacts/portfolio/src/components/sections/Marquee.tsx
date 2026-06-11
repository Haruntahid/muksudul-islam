import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { getTechIconComponent } from "@/lib/icons";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Marquee() {
  const { data, isLoading } = usePortfolio();
  const tools = data.settings.marquee_tools ?? [];

  if (isLoading) {
    return (
      <div className="py-8 border-y border-border/50 overflow-hidden bg-background/30">
        <div className="flex gap-10 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
        </div>
      </div>
    );
  }

  const repeated = [...tools, ...tools, ...tools];

  return (
    <div className="py-8 border-y border-border/50 overflow-hidden bg-background/30">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-10 w-max"
      >
        {repeated.map((tool, i) => {
          const Icon = tool.icon ? getTechIconComponent(tool.icon) : null;
          return (
            <div key={`${tool.name}-${i}`} className="flex items-center gap-2.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors select-none">
              {Icon && <Icon className="w-5 h-5" style={{ color: tool.color, opacity: 0.7 }} />}
              <span className="text-sm font-mono whitespace-nowrap">{tool.name}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
