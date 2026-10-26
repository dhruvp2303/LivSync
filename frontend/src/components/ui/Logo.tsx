import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  subtitle?: boolean | string;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: { icon: 24, font: 'text-base', sub: 'text-[9px]' },
  sm: { icon: 32, font: 'text-lg', sub: 'text-[9px]' },
  md: { icon: 40, font: 'text-xl', sub: 'text-[10px]' },
  lg: { icon: 48, font: 'text-2xl', sub: 'text-xs' },
  xl: { icon: 64, font: 'text-3xl', sub: 'text-xs' },
};

/**
 * Pure SVG Icon Mark for LivSync
 * Two harmonized, interlocking living arches + glowing sync nexus.
 */
export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        <linearGradient id="lsBgGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id="lsAccentGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        <linearGradient id="lsGlassGradComp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle Base with smooth rounded corner */}
      <rect width="512" height="512" rx="128" fill="url(#lsBgGradComp)" />

      {/* Gloss Highlight */}
      <path
        d="M 0 128 C 0 57.3 57.3 0 128 0 L 384 0 C 454.7 0 512 57.3 512 128 L 512 240 C 360 200 152 200 0 240 Z"
        fill="url(#lsGlassGradComp)"
      />

      {/* Outer Subtle Rim Border */}
      <rect
        x="2"
        y="2"
        width="508"
        height="508"
        rx="126"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.2"
        strokeWidth="4"
      />

      {/* Harmonized Living & Sync Symbol */}
      <g>
        {/* Pulse Resonance Rings */}
        <circle
          cx="256"
          cy="256"
          r="148"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeDasharray="24 16"
          opacity="0.22"
        />
        <circle
          cx="256"
          cy="256"
          r="105"
          fill="none"
          stroke="url(#lsAccentGradComp)"
          strokeWidth="4"
          opacity="0.32"
        />

        {/* Left Living Home Pillar / Arch (Person 1 - Liv) */}
        <path
          d="M 160 336 L 160 248 C 160 195 203 152 256 152 C 280 152 302 161 318 176"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Sync Loop Pillar / Arch (Person 2 - Sync) */}
        <path
          d="M 352 176 L 352 264 C 352 317 309 360 256 360 C 232 360 210 351 194 336"
          fill="none"
          stroke="url(#lsAccentGradComp)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Compatibility Core */}
        <circle
          cx="256"
          cy="256"
          r="32"
          fill="#0F172A"
          stroke="#FFFFFF"
          strokeWidth="8"
        />
        <circle cx="256" cy="256" r="16" fill="#38BDF8" />
        <circle cx="256" cy="256" r="7" fill="#FFFFFF" />

        {/* Upper & Lower Sync Nodes */}
        <circle cx="160" cy="336" r="18" fill="#FFFFFF" />
        <circle cx="352" cy="176" r="18" fill="#38BDF8" />
      </g>
    </svg>
  );
};

/**
 * Standard LivSync Brand Logo (Icon + Wordmark + Optional Subtitle)
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  subtitle,
  className = '',
  textClassName = '',
  onClick,
}) => {
  const config =
    typeof size === 'number'
      ? { icon: size, font: 'text-xl', sub: 'text-[10px]' }
      : sizeMap[size] || sizeMap.md;

  const subtitleText =
    typeof subtitle === 'string'
      ? subtitle
      : subtitle === true
      ? 'Roommate Compatibility Network'
      : null;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center filter drop-shadow-sm transition-transform active:scale-95">
        <LogoIcon size={config.icon} />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-black tracking-tight text-slate-900 ${config.font} ${textClassName}`}
          >
            Liv<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Sync</span>
          </span>
          {subtitleText && (
            <span
              className={`font-semibold tracking-wider uppercase text-slate-500 mt-1 ${config.sub}`}
            >
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
