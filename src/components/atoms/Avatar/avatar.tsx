import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({ src, alt, fallback, className }) => {
  // Create initials from the name if alt is provided
  const initials = alt
    ? alt
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-medium overflow-hidden",
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : fallback ? (
        fallback
      ) : (
        <span className="text-sm">{initials}</span>
      )}
    </div>
  );
}; 