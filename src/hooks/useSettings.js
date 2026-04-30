import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function useSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const loading = useSettingsStore((s) => s.loading);
  const loaded = useSettingsStore((s) => s.loaded);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const getSetting = useSettingsStore((s) => s.getSetting);

  useEffect(() => {
    if (!loaded) fetchSettings();
  }, [loaded, fetchSettings]);

  return { settings, loading, getSetting };
}