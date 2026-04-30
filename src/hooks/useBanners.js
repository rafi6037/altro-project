import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useBanners(type) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchBanners = async () => {
      try {
        let query = supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (type) query = query.eq('type', type);

        const { data, error: queryError } = await query;
        if (queryError) throw queryError;
        if (!cancelled) setBanners(data ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message ?? 'Failed to load banners.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBanners();
    return () => { cancelled = true; };
  }, [type]);

  return { banners, loading, error };
}