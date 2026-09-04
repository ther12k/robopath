import React from 'react';

export interface ChipProps {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'action' | 'primary' | 'coral';
  className?: string;
  style?: React.CSSProperties;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  value,
  icon,
  variant = 'neutral',
  className = '',
  style,
}) => {
  const bgColors: Record<string, string> = {
    neutral: 'var(--color-surface)',
    accent: '#fef3c7',
    action: '#dcfce7',
    primary: '#dbeafe',
    coral: '#fee2e2',
  };

  const textColors: Record<string, string> = {
    neutral: 'var(--color-ink)',
    accent: '#92400e',
    action: '#166534',
    primary: '#1e40af',
    coral: '#991b1b',
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '36px',
    padding: '0 12px',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: bgColors[variant],
    color: textColors[variant],
    fontWeight: 700,
    fontSize: 'var(--text-sm)',
    border: '1px solid var(--color-border-subtle)',
    boxShadow: 'var(--shadow-sm)',
    userSelect: 'none',
    ...style,
  };

  return (
    <div style={baseStyle} className={`rp-chip ${className}`} role="status">
      {icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{label}</span>
      {value !== undefined && <span style={{ opacity: 0.9 }}>{value}</span>}
    </div>
  );
};
