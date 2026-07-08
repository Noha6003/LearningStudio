'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeMode } from '../providers/theme-mode-provider';

interface AdvancedOptionsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdvancedOptions({
  title = "Advanced Settings",
  children,
  className
}: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  return (
    <div
      className={cn(
        "border transition-all duration-200",
        isKids
          ? "rounded-2xl border-2 border-border/80 bg-card/60"
          : "rounded-lg border-border bg-card/40",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 font-medium transition-colors cursor-pointer select-none text-left",
          isKids ? "text-md font-bold text-foreground" : "text-sm text-foreground/80 hover:text-foreground"
        )}
      >
        <div className="flex items-center space-x-2">
          <Settings className={cn("h-4 w-4", isKids ? "text-brand-secondary" : "text-muted-foreground")} />
          <span>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "p-4 pt-0 border-t border-dashed",
                isKids ? "border-border/40 text-sm" : "border-border/60 text-xs text-muted-foreground"
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
