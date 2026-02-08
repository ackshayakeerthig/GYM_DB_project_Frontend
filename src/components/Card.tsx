import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
}

export function Card({ title, children, className = '', header }: CardProps) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 ${className}`}>
      {(title || header) && (
        <div className="mb-6">
          {header && header}
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
        </div>
      )}
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        {icon && <div className="text-emerald-500 text-2xl">{icon}</div>}
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
