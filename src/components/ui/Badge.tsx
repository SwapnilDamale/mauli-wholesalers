interface BadgeProps {
  variant: 'available' | 'outOfStock' | 'seasonal' | 'featured';
  children: React.ReactNode;
}

const styles: Record<BadgeProps['variant'], string> = {
  available: 'bg-green-100 text-green-800',
  outOfStock: 'bg-red-100 text-red-800',
  seasonal: 'bg-amber-100 text-amber-800',
  featured: 'bg-primary-100 text-primary-800',
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
