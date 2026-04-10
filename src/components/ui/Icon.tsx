import type { LucideIcon, LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  icon: LucideIcon;
}

/** Wraps Lucide icons with `aria-hidden` for accessibility. */
export function Icon({ icon: Component, ...props }: IconProps) {
  return <Component aria-hidden="true" {...props} />;
}
