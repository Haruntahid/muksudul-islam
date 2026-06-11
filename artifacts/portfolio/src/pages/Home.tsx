import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import CommandCenter from "@/components/sections/CommandCenter";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import GitHubSection from "@/components/sections/GitHub";
import Healthcare from "@/components/sections/Healthcare";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <CommandCenter />
        <Skills />
        <Experience />
        <Projects />
        <GitHubSection />
        <Healthcare />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
