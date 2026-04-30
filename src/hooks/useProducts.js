import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_PAGE_SIZE = 12;

export function useProducts(filters = {}) {
  const {
    category,
    tag,
    featured,
    search,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = filters;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchProducts = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('is_active', true);

        if (category) query = query.eq('category', category);
        if (featured !== undefined) query = query.eq('featured', featured);
        if (tag) query = query.contains('tags', [tag]);
        if (search) query = query.ilike('name', `%${search}%`);

        const from = (pageNum - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to).order('created_at', { ascending: false });

        const { data, error: queryError, count } = await query;
        if (queryError) throw queryError;

        setProducts((prev) => (append ? [...prev, ...(data ?? [])] : (data ?? [])));
        setTotal(count ?? 0);
        setCurrentPage(pageNum);
      } catch (err) {
        setError(err.message ?? 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    },
    [category, tag, featured, search, pageSize]
  );

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const hasMore = products.length < total;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchProducts]);

  return { products, loading, error, total, hasMore, loadMore };
}