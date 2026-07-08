'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useThemeMode } from '../providers/theme-mode-provider';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, children, hoverEffect = false, ...props }: CardProps) {
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  return (
    <div
      className={cn(
        "bg-card text-card-foreground border transition-all duration-200",
        isKids
          ? "rounded-[1.5rem] border-4 border-border/80 shadow-[6px_6px_0px_rgba(0,0,0,0.08)]"
          : "rounded-xl border-border shadow-sm",
        hoverEffect && (
          isKids
            ? "hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.12)] cursor-pointer"
            : "hover:shadow-md hover:border-brand-primary/50 transition-shadow cursor-pointer"
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { themeMode } = useThemeMode();
  return (
    <h3
      className={cn(
        "font-semibold leading-none tracking-tight",
        themeMode === 'kids' ? "text-xl md:text-2xl font-bold" : "text-lg",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
