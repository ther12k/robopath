import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'action' | 'accent' | 'secondary' | 'coral';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const bgColors: Record<string, string> = {
    primary: 'var(--color-primary)',
    action: 'var(--color-action)',
    accent: 'var(--color-accent)',
    secondary: 'var(--color-surface)',
    coral: 'var(--color-coral)',
  };

  const textColors: Record<string, string> = {
    primary: '#ffffff',
    action: '#ffffff',
    accent: 'var(--color-ink)',
    secondary: 'var(--color-ink)',
    coral: '#ffffff',
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: size === 'lg' ? '56px' : '48px',
    minWidth: '48px',
    padding: size === 'lg' ? '12px 24px' : '8px 18px',
    fontSize: size === 'lg' ? 'var(--text-lg)' : 'var(--text-base)',
    fontWeight: 700,
    borderRadius: 'var(--radius-btn)',
    border: variant === 'secondary' ? '2px solid var(--color-border)' : 'none',
    backgroundColor: bgColors[variant],
    color: textColors[variant],
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    boxShadow: disabled ? 'none' : 'var(--shadow-sm)',
    transition: 'transform 0.1s ease, filter 0.1s ease',
    width: fullWidth ? '100%' : 'auto',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled}
      className={`rp-button ${className}`}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
