import { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: FC<CardProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  );
};

export const CardHeader: FC<CardHeaderProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
};

export const CardTitle: FC<CardTitleProps> = ({ className, ...props }) => {
  return (
    <h3
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    />
  );
};

export const CardContent: FC<CardContentProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-6 pt-0', className)} {...props} />
  );
};

export const CardFooter: FC<CardFooterProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  );
}; 