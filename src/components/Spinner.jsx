const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

export default function Spinner({ size = 'md', color }) {
  const sizeClasses = sizeMap[size] ?? sizeMap.md;
  const style = {
    borderColor: color ?? '#1a5c38',
    borderTopColor: 'transparent',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      style={style}
      className={`inline-block rounded-full animate-spin ${sizeClasses}`}
    />
  );
}