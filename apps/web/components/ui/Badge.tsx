import { cn, getTierColor, getTierLabel } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { Star, Award, Gem } from 'lucide-react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface TierBadgeProps {
  tier: 'silver' | 'gold' | 'platinum';
  size?: 'sm' | 'md' | 'lg';
}

const tierIcons = {
  silver: Star,
  gold: Award,
  platinum: Gem,
};

const tierSizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const Icon = tierIcons[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        getTierColor(tier),
        tierSizes[size]
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      Hạng {getTierLabel(tier)}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const statusConfig = {
  pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
  completed: { label: 'Hoàn thành', className: 'bg-blue-100 text-blue-700' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
