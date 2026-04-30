/**
 * Validates a coupon code against the database.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} code
 * @param {number} subtotal
 * @returns {Promise<{valid: boolean, coupon: object|null, error: string|null}>}
 */
export async function validateCoupon(supabase, code, subtotal) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', code.trim())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { valid: false, coupon: null, error: 'Invalid coupon code.' };
    }

    const coupon = data;

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { valid: false, coupon: null, error: 'This coupon has expired.' };
    }

    if (coupon.min_order != null && subtotal < coupon.min_order) {
      return {
        valid: false,
        coupon: null,
        error: `Minimum order of ৳${coupon.min_order} required for this coupon.`,
      };
    }

    if (coupon.max_uses != null && coupon.used_count >= coupon.max_uses) {
      return { valid: false, coupon: null, error: 'This coupon has reached its usage limit.' };
    }

    return { valid: true, coupon, error: null };
  } catch {
    return { valid: false, coupon: null, error: 'An error occurred while validating the coupon.' };
  }
}