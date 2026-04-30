import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useSettingsStore = create((set, get) => ({
  settings: {},
  loading: false,
  loaded: false,

  fetchSettings: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      const mapped = {};
      (data ?? []).forEach((row) => {
        mapped[row.key] = row.value;
      });
      set({ settings: mapped, loaded: true });
    } catch {
      // silently fail; settings remain empty
    } finally {
      set({ loading: false });
    }
  },

  getSetting: (key, defaultValue = null) => {
    return get().settings[key] ?? defaultValue;
  },
}));