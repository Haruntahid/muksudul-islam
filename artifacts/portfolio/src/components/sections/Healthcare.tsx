import { motion } from "framer-motion";
import { HeartPulse, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Healthcare() {
  const { data, isLoading } = usePortfolio();
  const products = data.settings.healthcare_products ?? [];
  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="healthcare" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <HeartPulse className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.healthcare ?? "Healthcare Systems Tested"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">grep -r "CMED Health" --tested-products</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`healthcare-card-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`group relative rounded-xl border bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 overflow-hidden ${product.accentColor ?? "border-border"}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.glow ?? "from-primary/5"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
                    <h3 className="text-lg font-bold font-mono">{product.name}</h3>
                    {product.badge && (
                      <span className={`px-2 py-0.5 text-xs font-mono rounded-full border ${product.badgeColor ?? "border-border"}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>

                  <div className="space-y-2">
                    {(product.features ?? []).map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  {product.clients && product.clients.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-mono">Clients</p>
                      <div className="flex flex-wrap gap-2">
                        {product.clients.map((c) => (
                          <span key={c} className="px-2 py-0.5 text-xs font-mono rounded bg-background/60 border border-border/50">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
