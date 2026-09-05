import clsx from 'clsx';
import './design-tokens.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'primary' | 'secondary';
};

export function PrimaryButton({ tone = 'primary', className, ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx('rp-btn', `rp-btn--${tone}`, className)}
    />
  );
}
