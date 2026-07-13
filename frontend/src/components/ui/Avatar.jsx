import React, { useState, useEffect } from 'react';

const PALETTE = [
  '#2563EB', // Blue
  '#059669', // Emerald
  '#4F46E5', // Indigo
  '#E11D48', // Rose
  '#D97706', // Amber
  '#0D9488', // Teal
  '#7C3AED', // Purple
  '#0891B2'  // Cyan
];

const getAvatarColor = (name) => {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
};

const getInitials = (name) => {
  if (!name) return 'RC';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  isOnline = false,
  shape = 'rounded-2xl'
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl'
  };

  const resolvedSizeClass = sizeClasses[size] || size;

  // Render SVG fallback
  const renderFallback = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full select-none"
      style={{ backgroundColor: bgColor }}
    >
      <text
        x="50"
        y="53"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="36"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );

  return (
    <div className={`relative flex-shrink-0 ${resolvedSizeClass} ${className}`}>
      <div className={`w-full h-full overflow-hidden ${shape} bg-slate-100 border border-slate-100 flex items-center justify-center`}>
        {src && !hasError ? (
          <img
            src={src}
            alt={name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          renderFallback()
        )}
      </div>

      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm ring-1 ring-black/5`}
          title="Online"
        />
      )}
    </div>
  );
};

export default Avatar;
