import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";
import { getSocialIconComponent } from "@/lib/icons";
import { api } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { data, isLoading } = usePortfolio();
  const contactIntro = data.settings.contact_intro;
  const contactSocials = data.socials.filter((s) => s.icon !== "map-pin");

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(formData: FormData) {
    try {
      await api.submitContactMessage(formData);
      setSubmitted(true);
      toast.success("Message sent!", { description: `Thanks ${formData.name}, I'll get back to you soon.` });
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      toast.error("Failed to send message", { description: String(err) });
    }
  }

  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="contact" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              {sectionTitles.contact ?? "Get in Touch"}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm ml-10">curl -X POST /api/contact --data message</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {isLoading ? (
              <Skeleton className="h-16 w-full mb-8" />
            ) : (
              <p className="text-muted-foreground leading-relaxed mb-8">{contactIntro}</p>
            )}

            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))
              : contactSocials.map((item) => {
                  const Icon = getSocialIconComponent(item.icon ?? "globe");
                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{item.platform}</p>
                        {item.url ? (
                          <a
                            href={item.url}
                            target={item.url.startsWith("http") ? "_blank" : undefined}
                            rel="noreferrer"
                            className="text-sm font-mono text-foreground hover:text-primary transition-colors"
                            data-testid={`contact-link-${item.platform.toLowerCase()}`}
                          >
                            {item.label ?? item.url}
                          </a>
                        ) : (
                          <p className="text-sm font-mono text-foreground">{item.label}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {submitted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-primary/30 bg-card/40 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                </motion.div>
                <p className="text-lg font-mono font-bold text-primary">Message Sent!</p>
                <p className="text-sm text-muted-foreground">I'll get back to you soon.</p>
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 space-y-4 ${submitted ? "opacity-0 pointer-events-none" : ""}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    data-testid="input-name"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    data-testid="input-email"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="subject" className="font-mono text-xs uppercase tracking-wider">Subject</Label>
                <Input
                  id="subject"
                  placeholder="QA Engineer Opportunity"
                  data-testid="input-subject"
                  {...register("subject")}
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="message" className="font-mono text-xs uppercase tracking-wider">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about the opportunity or project..."
                  data-testid="textarea-message"
                  {...register("message")}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-mono"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
