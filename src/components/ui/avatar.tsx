interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = sizeMap[size];
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${className}`}
      style={{ background: 'linear-gradient(135deg, #E94560, #0F3460)' }}
    >
      {initials}
    </div>
  );
}
