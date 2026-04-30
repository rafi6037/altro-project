const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const variantStyles = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  processing: 'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Badge({ status, variant, children }) {
  const style =
    (status && statusStyles[status]) ||
    (variant && variantStyles[variant]) ||
    'bg-gray-100 text-gray-700';

  const label = children ?? (status ? (statusLabels[status] ?? status) : '');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}