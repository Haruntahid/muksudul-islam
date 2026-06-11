import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { PortfolioSettings } from "@/lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<PortfolioSettings>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await api.getSettings();
      const obj: PortfolioSettings = {};
      items.forEach((i) => {
        (obj as Record<string, unknown>)[i.key] = i.value;
      });
      setSettings(obj);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveSetting(key: string, value: unknown) {
    await api.upsertSetting(key, value);
    setSettings((s) => ({ ...s, [key]: value }));
  }

  return { settings, loading, saveSetting, reload: load };
}
