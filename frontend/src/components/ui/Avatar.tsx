import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  alt?: string;
}

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs rounded-lg',
  md: 'w-10 h-10 text-sm rounded-xl',
  lg: 'w-12 h-12 text-base rounded-xl',
  xl: 'w-16 h-16 text-xl rounded-2xl',
  '2xl': 'w-20 h-20 text-2xl rounded-2xl',
  '3xl': 'w-24 h-24 text-3xl rounded-3xl',
};

// Curated soft gradient palettes derived from name so different users get distinct subtle tones
const PALETTES = [
  'from-indigo-600 to-indigo-700 text-white',
  'from-blue-600 to-blue-700 text-white',
  'from-slate-700 to-slate-800 text-white',
  'from-teal-600 to-teal-700 text-white',
  'from-violet-600 to-violet-700 text-white',
];

export function Avatar({ src, name, size = 'md', className = '', alt }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : '?';
  const charCode = (name?.charCodeAt(0) || 0) + (name?.charCodeAt(1) || 0);
  const palette = PALETTES[charCode % PALETTES.length];

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`${sizeClass} object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`${sizeClass} bg-gradient-to-br ${palette} flex items-center justify-center font-bold tracking-tight select-none shadow-xs border border-white/20 ${className}`}
    >
      {initial}
    </div>
  );
}
