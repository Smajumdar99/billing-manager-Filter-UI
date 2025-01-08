import { FC } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  className,
  fallback
}) => {
  if (!src) {
    return (
      <div className={cn(
        "flex items-center justify-center rounded-full bg-primary/10",
        className
      )}>
        <span className="text-primary font-medium">
          {fallback || alt.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", className)}
    />
  );
}; 