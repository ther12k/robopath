import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'action' | 'secondary' | 'coral' | 'ghost';
  size?: 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  variant = 'secondary',
  size = 'md',
  disabled,
  style,
  className = '',
  ...props
}) => {
  const bgColors: Record<string, string> = {
    primary: 'var(--color-primary)',
    action: 'var(--color-action)',
    secondary: 'var(--color-surface)',
    coral: 'var(--color-coral)',
    ghost: 'transparent',
  };

  const textColors: Record<string, string> = {
    primary: '#ffffff',
    action: '#ffffff',
    secondary: 'var(--color-ink)',
    coral: '#ffffff',
    ghost: 'var(--color-ink)',
  };

  const dimension = size === 'lg' ? '56px' : '48px';

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension,
    height: dimension,
    minWidth: '48px',
    minHeight: '48px',
    borderRadius: 'var(--radius-btn)',
    border: variant === 'secondary' ? '2px solid var(--color-border)' : 'none',
    backgroundColor: bgColors[variant],
    color: textColors[variant],
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    boxShadow: disabled || variant === 'ghost' ? 'none' : 'var(--shadow-sm)',
    padding: 0,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  return (
    <button
      style={baseStyle}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`rp-icon-button ${className}`}
      {...props}
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </span>
    </button>
  );
};
