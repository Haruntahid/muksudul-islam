import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = usePortfolio();
  const hero = data.settings.hero ?? {};
  const firstName = hero.name?.split(" ")[0] ?? "Portfolio";
  const brandInitial = firstName.charAt(0);
  const brandRest = firstName.slice(1);

  const sectionTitles = data.settings.section_titles ?? {};
  const navItems = [
    { label: sectionTitles.experience ?? "Experience", id: "experience" },
    { label: sectionTitles.skills ?? "Skills", id: "skills" },
    { label: sectionTitles.projects ?? "Projects", id: "projects" },
    { label: sectionTitles.contact ?? "Contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {isLoading ? (
          <Skeleton className="h-6 w-28" />
        ) : (
          <a href="#" className="font-mono font-bold text-xl tracking-tighter">
            <span className="text-primary">{brandInitial}</span>
            {brandRest}.
          </a>
        )}

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {isLoading ? (
            <Skeleton className="hidden md:block h-9 w-36" />
          ) : hero.resumeUrl ? (
            <Button
              className="hidden md:inline-flex bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              asChild
            >
              <a href={hero.resumeUrl} target="_blank" rel="noreferrer">
                Download Resume
              </a>
            </Button>
          ) : (
            <Button
              className="hidden md:inline-flex bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              asChild
            >
              <a href="#contact">Download Resume</a>
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
