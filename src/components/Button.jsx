import Spinner from './Spinner';

const variantStyles = {
  primary: 'bg-[#1a5c38] text-white hover:bg-[#2a7d50] focus-visible:ring-[#1a5c38]',
  secondary: 'bg-[#c9f230] text-[#0e1a12] hover:bg-lime-300 focus-visible:ring-[#c9f230]',
  outline:
    'border border-[#1a5c38] text-[#1a5c38] bg-transparent hover:bg-[#1a5c38]/10 focus-visible:ring-[#1a5c38]',
  ghost: 'text-[#1a5c38] bg-transparent hover:bg-[#1a5c38]/10 focus-visible:ring-[#1a5c38]',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
};

const spinnerSizeMap = { sm: 'sm', md: 'sm', lg: 'md' };

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variantStyles[variant] ?? variantStyles.primary,
        sizeStyles[size] ?? sizeStyles.md,
        isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <Spinner
          size={spinnerSizeMap[size] ?? 'sm'}
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#1a5c38'}
        />
      )}
      {children}
    </button>
  );
}