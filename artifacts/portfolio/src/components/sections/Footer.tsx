import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";
import { getSocialIconComponent } from "@/lib/icons";

export default function Footer() {
  const { data, isLoading } = usePortfolio();
  const footer = data.settings.footer;
  const socials = data.socials.filter((s) => s.url && s.icon !== "map-pin");

  return (
    <footer className="border-t border-border/50 py-10 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-64 mx-auto md:mx-0 mb-2" />
                <Skeleton className="h-3 w-48 mx-auto md:mx-0" />
              </>
            ) : (
              <>
                <p className="font-mono text-sm text-muted-foreground">
                  {footer?.tagline ?? "Built with Passion for Quality Engineering."}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                  &copy; {new Date().getFullYear()} {footer?.copyrightName ?? "Portfolio"}. All rights reserved.
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-9 rounded-lg" />
                ))
              : socials.map((s) => {
              const Icon = getSocialIconComponent(s.icon ?? "globe");
              return (
                <a
                  key={s._id}
                  href={s.url}
                  target={s.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  data-testid={`footer-${s.platform.toLowerCase()}`}
                  className="p-2 rounded-lg border border-border hover:border-primary/40 hover:text-primary text-muted-foreground transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
