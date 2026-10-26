import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-[#5B5BFF] text-white hover:bg-[#4a4ae6] focus:ring-[#5B5BFF] shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary:
      'bg-white text-[#5B5BFF] border-2 border-[#5B5BFF] hover:bg-[#5B5BFF]/5 focus:ring-[#5B5BFF] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#647488] hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-red-400 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
}
