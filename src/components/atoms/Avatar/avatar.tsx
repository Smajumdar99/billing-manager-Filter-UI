import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Avatar component with fallback initials
 * Handles image loading states and provides a fallback with user initials
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  fallback = 'U',
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const getFallbackInitials = () => {
    if (!alt || alt === 'User avatar') return fallback;
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src || imageError) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600 ring-2 ring-white',
          sizeClasses[size],
          className
        )}
        title={alt}
      >
        {getFallbackInitials()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-full ring-2 ring-white overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Avatar; 