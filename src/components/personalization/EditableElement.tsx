'use client';

import { ReactNode, useCallback } from 'react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import type { EditableElementConfig } from '@/lib/personalization-types';
import { motion } from 'framer-motion';

interface EditableElementProps {
  elementConfig: EditableElementConfig;
  children: ReactNode;
  className?: string;
}

export function EditableElement({ elementConfig, children, className = '' }: EditableElementProps) {
  const { state, selectElement } = usePersonalization();
  const { isEditMode, selectedElement } = state;

  const isSelected = selectedElement?.elementId === elementConfig.elementId;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode) {
        e.stopPropagation();
        selectElement(elementConfig);
      }
    },
    [isEditMode, elementConfig, selectElement]
  );

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`relative ${className}`}
      style={{
        cursor: isEditMode ? 'pointer' : 'default'
      }}
      whileHover={isEditMode ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
    >
      {isEditMode && (
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-200 rounded ${
            isSelected
              ? 'ring-2 ring-primary ring-offset-2 bg-primary/5'
              : 'hover:ring-2 hover:ring-primary/50 hover:bg-primary/5'
          }`}
        />
      )}
      {isEditMode && isSelected && (
        <div className="absolute -top-6 left-0 z-50 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-t pointer-events-none">
          {elementConfig.elementLabel}
        </div>
      )}
      {children}
    </motion.div>
  );
}
