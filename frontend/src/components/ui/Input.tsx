import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, type = 'text', className = '', ...props }, ref) => {
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`w-full rounded-xl border bg-white border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 text-sm
              transition-all duration-150 outline-none
              ${icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-11' : ''}
              ${error
                ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
              }
              ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3.5 text-slate-400 hover:text-indigo-600 transition-colors"
              onClick={() => setShowPass((v) => !v)}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
