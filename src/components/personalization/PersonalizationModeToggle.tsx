'use client';

import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkle, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalizationModeToggleProps {
  className?: string;
}

export function PersonalizationModeToggle({ className = '' }: PersonalizationModeToggleProps) {
  const { state, setEditMode } = usePersonalization();
  const { isEditMode } = state;

  return (
    <>
      <Button
        variant={isEditMode ? 'default' : 'outline'}
        size="sm"
        onClick={() => setEditMode(!isEditMode)}
        className={`gap-2 ${className}`}
      >
        {isEditMode ? (
          <>
            <X className="w-4 h-4" />
            Salir del modo edición
          </>
        ) : (
          <>
            <Sparkle className="w-4 h-4" weight="fill" />
            Modo personalización
          </>
        )}
      </Button>

      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[90] bg-primary text-primary-foreground shadow-lg"
          >
            <div className="container mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-2">
                    <Sparkle className="w-3 h-3" weight="fill" />
                    Modo Personalización Activo
                  </Badge>
                  <p className="text-sm">
                    Haz clic en cualquier elemento para personalizarlo
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditMode(false)}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Salir
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
