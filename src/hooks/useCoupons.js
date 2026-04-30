import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setCoupons(data ?? []);
    } catch (err) {
      setError(err.message ?? 'Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return { coupons, loading, error, refresh: fetchCoupons };
}