import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { getSocialIconComponent, getTechIconComponent } from "@/lib/icons";

const ORBIT_POSITIONS = [
  "absolute -top-4 left-1/2 -translate-x-1/2",
  "absolute top-1/2 -right-4 -translate-y-1/2",
  "absolute -bottom-4 left-1/2 -translate-x-1/2",
];

export default function Hero() {
  const { data, isLoading } = usePortfolio();
  const hero = data.settings.hero ?? {};
  const socials = data.socials.filter((s) => s.icon !== "map-pin");
  const orbitTools = (data.settings.marquee_tools ?? []).slice(0, 3);

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full max-w-md" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-20 w-full max-w-lg" />
          </div>
          <Skeleton className="h-80 w-80 rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0 pointer-events-none" />

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {hero.badge && (
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono font-medium border border-primary/20">
              {hero.badge}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            {hero.name}
          </h1>

          <h2 className="text-xl md:text-2xl text-muted-foreground font-mono">
            {hero.title}
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg">{hero.tagline}</p>

          <div className="flex flex-wrap gap-4 pt-4">
            {hero.resumeUrl ? (
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <a href={hero.resumeUrl} target="_blank" rel="noreferrer">Download Resume</a>
              </Button>
            ) : (
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Download Resume
              </Button>
            )}
            <Button size="lg" variant="outline" className="border-border hover:bg-muted" asChild>
              <a href="#projects">View Projects</a>
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-8 text-muted-foreground">
            {socials.map((s) => {
              const Icon = getSocialIconComponent(s.icon ?? "globe");
              return s.url ? (
                <a
                  key={s._id}
                  href={s.url}
                  target={s.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ) : null;
            })}
            {hero.location && (
              <div className="flex items-center gap-2 text-sm font-mono ml-4">
                <MapPin className="w-4 h-4" /> {hero.location}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/30 backdrop-blur-sm overflow-hidden">
            {hero.profileImageUrl ? (
              <img
                src={hero.profileImageUrl}
                alt={hero.name ?? "Profile"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="text-6xl font-bold text-primary font-mono">{hero.initials ?? "MI"}</div>
            )}

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
            >
              {orbitTools.map((tool, i) => {
                const Icon = tool.icon ? getTechIconComponent(tool.icon) : null;
                if (!Icon) return null;
                return (
                  <div
                    key={tool.name}
                    className={`${ORBIT_POSITIONS[i] ?? ORBIT_POSITIONS[0]} p-2 bg-background rounded-full border border-border shadow-lg`}
                    style={{ color: tool.color ?? "hsl(var(--primary))" }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
