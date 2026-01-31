
import React from 'react';

interface Button3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'dark';
  fullWidth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

const Button3D: React.FC<Button3DProps> = ({ 
  children, 
  onClick, 
  color = 'primary', 
  fullWidth = false, 
  className = '', 
  size = 'md',
  disabled = false
}) => {
  const colorMap = {
    primary: 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700',
    success: 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700',
    danger: 'bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700',
    warning: 'bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600',
    neutral: 'bg-white text-slate-900 border border-slate-200 shadow-slate-50 hover:bg-slate-50',
    dark: 'bg-slate-950 text-white shadow-slate-900 hover:bg-slate-900',
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full',
    md: 'px-8 py-4 text-xs font-black uppercase tracking-widest rounded-full',
    lg: 'px-10 py-5 text-base font-bold tracking-tight rounded-2xl',
    xl: 'px-12 py-7 text-xl font-black tracking-tighter rounded-3xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${colorMap[color]}
        ${sizeClasses[size]}
        relative
        flex items-center justify-center gap-3
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:-translate-y-0.5
        active:scale-95 active:translate-y-0
        disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none
        select-none
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {color !== 'neutral' && (
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
      )}
    </button>
  );
};

export default Button3D;
