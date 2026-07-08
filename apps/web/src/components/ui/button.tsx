'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useThemeMode } from '../providers/theme-mode-provider';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  ...props
}: ButtonProps) {
  const { themeMode } = useThemeMode();

  const isKids = themeMode === 'kids';

  // Base styles
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  // Custom theme shapes
  const shapeStyles = isKids 
    ? "rounded-2xl font-bold uppercase tracking-wider border-b-4 active:border-b-0 transform"
    : "rounded-lg text-sm active:scale-98 shadow-sm";

  // Mode specific color variants
  const colorStyles = {
    primary: isKids
      ? "bg-brand-primary text-white border-brand-primary/80 hover:bg-brand-primary/95 text-shadow-sm"
      : "bg-brand-primary text-white hover:bg-brand-primary/90",
    secondary: isKids
      ? "bg-brand-secondary text-white border-brand-secondary/80 hover:bg-brand-secondary/95"
      : "bg-brand-secondary text-white hover:bg-brand-secondary/90",
    success: isKids
      ? "bg-brand-success text-white border-brand-success/80 hover:bg-brand-success/95"
      : "bg-brand-success text-white hover:bg-brand-success/90",
    danger: isKids
      ? "bg-brand-danger text-white border-brand-danger/80 hover:bg-brand-danger/95"
      : "bg-brand-danger text-white hover:bg-brand-danger/90",
    warning: isKids
      ? "bg-brand-warning text-white border-brand-warning/80 hover:bg-brand-warning/95"
      : "bg-brand-warning text-white hover:bg-brand-warning/90",
    info: isKids
      ? "bg-brand-info text-white border-brand-info/80 hover:bg-brand-info/95"
      : "bg-brand-info text-white hover:bg-brand-info/90",
    outline: isKids
      ? "bg-transparent text-foreground border-2 border-border hover:bg-card"
      : "bg-transparent text-foreground border border-border hover:bg-card/50",
    ghost: "bg-transparent text-foreground hover:bg-card"
  };

  // Size styles
  const sizeStyles = {
    sm: isKids ? "px-4 py-1.5 text-xs border-b-2" : "px-3 py-1.5 text-xs",
    md: isKids ? "px-6 py-2.5 text-sm border-b-4" : "px-4 py-2 text-sm",
    lg: isKids ? "px-8 py-3.5 text-md border-b-4" : "px-6 py-3 text-base"
  };

  // Play sound in Kids Mode
  const handlePlaySound = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isKids && typeof window !== 'undefined') {
      try {
        const audio = new Audio('/audio/click.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // catch autoplay blocks
      } catch (err) {}
    }
    if (onClick) onClick(e);
  };

  const buttonContent = (
    <button
      className={cn(baseStyles, shapeStyles, colorStyles[variant], sizeStyles[size], className)}
      onClick={handlePlaySound}
      {...props}
    >
      {children}
    </button>
  );

  // Apply framer motion bounciness in Kids Mode
  if (isKids) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
}
