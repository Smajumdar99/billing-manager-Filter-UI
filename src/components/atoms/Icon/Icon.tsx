import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { cn } from '@/lib/utils';

interface IconProps {
  icon: IconProp;
  className?: string;
  size?: 'xs' | 'sm' | 'lg' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
  spin?: boolean;
  pulse?: boolean;
  fixedWidth?: boolean;
  inverse?: boolean;
  flip?: 'horizontal' | 'vertical' | 'both';
  rotation?: 90 | 180 | 270;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  className,
  size,
  spin = false,
  pulse = false,
  fixedWidth = false,
  inverse = false,
  flip,
  rotation,
  onClick,
  ...props
}) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={cn(
        'inline-block',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      size={size}
      spin={spin}
      pulse={pulse}
      fixedWidth={fixedWidth}
      inverse={inverse}
      flip={flip}
      rotation={rotation}
      onClick={onClick}
      {...props}
    />
  );
};

export default Icon;
