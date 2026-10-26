interface BadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CompatibilityBadge({ score, size = 'md', className = '' }: BadgeProps) {
  const color =
    score >= 80
      ? 'bg-[#22C55E] text-white'
      : score >= 60
      ? 'bg-[#F59E0B] text-white'
      : 'bg-[#EF4444] text-white';

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-full font-bold',
    md: 'text-sm px-3 py-1 rounded-full font-bold',
    lg: 'text-base px-4 py-1.5 rounded-full font-bold',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${color} ${sizes[size]} ${className}`}>
      {score}% Match
    </span>
  );
}

interface TagProps {
  label: string;
  variant?: 'default' | 'purple' | 'green' | 'amber';
  className?: string;
}

export function Tag({ label, variant = 'default', className = '' }: TagProps) {
  const variants = {
    default: 'bg-gray-100 text-[#647488]',
    purple: 'bg-[#5B5BFF]/10 text-[#5B5BFF]',
    green: 'bg-[#22C55E]/10 text-[#22C55E]',
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
