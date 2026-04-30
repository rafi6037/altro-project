import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_PAGE_SIZE = 20;

export function useOrders(filters = {}) {
  const { status, search, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (search) {
        query = query.or(
          `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`
        );
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;
      if (queryError) throw queryError;
      setOrders(data ?? []);
      setTotal(count ?? 0);
    } catch (err) {
      setError(err.message ?? 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [status, search, page, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, total, refresh: fetchOrders };
}