import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, XCircle, Activity, ShieldCheck, Zap, Bug, GitCommit,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/context/PortfolioContext";
import type { CommandCenterLog, CommandCenterKpi } from "@/lib/types";

const DEFAULT_LOGS: CommandCenterLog[] = [
  { status: "pass", title: "Login API Validation", type: "API" },
  { status: "pass", title: "Patient Registration Flow", type: "E2E" },
  { status: "pass", title: "Regression Test Suite", type: "Regression" },
  { status: "fail", title: "Inventory Sync Endpoint", type: "API" },
  { status: "pass", title: "Performance Test Execution", type: "Performance" },
  { status: "pass", title: "OpenMRS Patient Workflow", type: "Integration" },
  { status: "pass", title: "Telemedicine Appointment Flow", type: "E2E" },
];

const DEFAULT_KPIS: CommandCenterKpi[] = [
  { value: "120+", label: "Bugs Reported", icon: "bug" },
  { value: "300+", label: "Tests Executed", icon: "zap" },
  { value: "95%", label: "Defect Reduction", icon: "shield" },
  { value: "9+", label: "Projects Delivered", icon: "git" },
];

const KPI_ICONS = {
  bug: Bug,
  zap: Zap,
  shield: ShieldCheck,
  git: GitCommit,
} as const;

export default function CommandCenter() {
  const { data, isLoading } = usePortfolio();
  const config = data.settings.command_center ?? {};
  const sourceLogs = config.logs?.length ? config.logs : DEFAULT_LOGS;
  const kpis = config.kpis?.length ? config.kpis : DEFAULT_KPIS;
  const automated = config.coverage?.automated ?? 75;
  const manual = config.coverage?.manual ?? 25;
  const quality = config.quality ?? {
    score: 98,
    automationCoverage: 75,
    deploymentReadiness: "HIGH",
    defectLeakage: "LOW",
  };

  const [logs, setLogs] = useState<CommandCenterLog[]>([]);

  const coverageData = useMemo(
    () => [
      { name: "Automated", value: automated, color: "hsl(var(--primary))" },
      { name: "Manual", value: manual, color: "hsl(var(--muted-foreground))" },
    ],
    [automated, manual],
  );

  useEffect(() => {
    setLogs(sourceLogs.slice(0, 4));
    let index = 4;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = sourceLogs[index % sourceLogs.length];
        index += 1;
        return [nextLog, ...prev].slice(0, 6);
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [sourceLogs]);

  if (isLoading) {
    return (
      <section id="command-center" className="py-20 relative border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const sectionTitles = data.settings.section_titles ?? {};

  return (
    <section id="command-center" className="py-20 relative border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
            {sectionTitles.command_center ?? "QA Operations Center"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-mono font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Live Test Execution
              </h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Running</span>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90 z-10 pointer-events-none" />
              <div className="space-y-3 relative z-0">
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log.title}-${i}`}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 text-sm font-mono p-2 rounded-md bg-background/50 border border-border/50"
                  >
                    {log.status === "pass" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    )}
                    <span className="text-muted-foreground w-20 shrink-0">
                      [{new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}]
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs uppercase tracking-wider ${
                        log.status === "pass" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-foreground truncate">{log.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {kpis.map((kpi) => {
              const Icon = KPI_ICONS[kpi.icon ?? "bug"] ?? Bug;
              const iconColor =
                kpi.icon === "zap"
                  ? "text-yellow-500"
                  : kpi.icon === "shield"
                    ? "text-green-500"
                    : kpi.icon === "git"
                      ? "text-purple-500"
                      : "text-primary";
              return (
                <div
                  key={kpi.label}
                  className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm flex flex-col justify-center items-center text-center hover:bg-card transition-colors"
                >
                  <Icon className={`w-6 h-6 ${iconColor} mb-2`} />
                  <div className="text-3xl font-bold font-mono">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{kpi.label}</div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm flex flex-col">
              <h3 className="font-mono font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">
                Test Coverage Split
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={coverageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {coverageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <h3 className="font-mono font-semibold mb-6 text-sm text-muted-foreground uppercase tracking-wider">
                Release Quality Monitor
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm font-mono text-primary">{quality.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${quality.score}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Automation Coverage</span>
                    <span className="text-sm font-mono text-primary">{quality.automationCoverage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${quality.automationCoverage}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Deployment Readiness</div>
                    <div className="font-mono text-green-500 font-bold">{quality.deploymentReadiness}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Defect Leakage</div>
                    <div className="font-mono text-green-500 font-bold">{quality.defectLeakage}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
