import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hover shadow effect */
  hoverable?: boolean;
  /** Removes padding */
  noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, noPadding = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          overflow-hidden rounded-xl border border-surface-200 bg-white
          ${hoverable ? 'transition-shadow duration-200 hover:shadow-lg' : ''}
          ${noPadding ? '' : 'p-6'}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/** Card header section */
function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

/** Card content section */
function CardContent({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

/** Card footer section */
function CardFooter({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 border-t border-surface-100 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
export { CardHeader, CardContent, CardFooter };
