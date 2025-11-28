'use client';

import { useEffect, useRef, useState } from 'react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  X,
  FloppyDisk,
  ArrowCounterClockwise,
  ArrowClockwise,
  Trash,
  Palette,
  TextT,
  Image as ImageIcon,
  CircleNotch,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { EditableProperty, PropertyValue } from '@/lib/personalization-types';

export function FloatingPersonalizationPanel() {
  const { state, selectElement, updateProperty, undo, redo, reset, saveCustomizations } =
    usePersonalization();
  const { selectedElement, historyIndex, history, customizations } = state;
  type SaveState = 'idle' | 'saving' | 'success' | 'error';
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panelToneClasses: Record<SaveState, string> = {
    idle: 'bg-card border-2 shadow-2xl',
    saving:
      'bg-gradient-to-br from-amber-100 via-amber-50 to-white border-amber-200 shadow-[0_15px_45px_rgba(245,158,11,0.2)] dark:from-amber-900/30 dark:via-amber-900/10 dark:to-transparent dark:border-amber-800',
    success:
      'bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 border-emerald-300 text-emerald-950 shadow-[0_20px_60px_rgba(16,185,129,0.35)] dark:from-emerald-900/50 dark:via-emerald-900/30 dark:to-transparent dark:border-emerald-800',
    error:
      'bg-gradient-to-br from-rose-200 via-rose-100 to-rose-50 border-rose-300 text-rose-950 shadow-[0_20px_60px_rgba(244,63,94,0.35)] dark:from-rose-900/50 dark:via-rose-900/30 dark:to-transparent dark:border-rose-800'
  };

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleSave = async () => {
    if (saveState === 'saving') return;

    setSaveState('saving');
    try {
      await saveCustomizations();
      toast.success('¡Cambios guardados exitosamente!');
      setSaveState('success');
    } catch (error) {
      console.error('No se pudieron guardar los cambios:', error);
      toast.error('No se pudieron guardar los cambios. Intenta de nuevo.');
      setSaveState('error');
    } finally {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
      resetTimer.current = setTimeout(() => setSaveState('idle'), 2000);
    }
  };

  const handleReset = () => {
    reset();
    toast.success('Personalizaciones reiniciadas');
  };

  const resolvePropertyValue = (property: EditableProperty) => {
    if (!selectedElement) {
      return property.value;
    }

    const elementCustomizations = customizations[selectedElement.elementId];
    if (elementCustomizations && elementCustomizations[property.id] !== undefined) {
      return elementCustomizations[property.id];
    }

    return property.value;
  };

  const renderPropertyEditor = (property: EditableProperty) => {
    const value = resolvePropertyValue(property);

    switch (property.type) {
      case 'color': {
        const colorValue = typeof value === 'string' && value.startsWith('#') ? value : '#000000';
        const textValue = typeof value === 'string' ? value : '';
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={colorValue}
              onChange={(e) =>
                updateProperty(selectedElement!.elementId, property.id, e.target.value)
              }
              className="w-16 h-10 cursor-pointer"
            />
            <Input
              value={textValue}
              onChange={(e) =>
                updateProperty(selectedElement!.elementId, property.id, e.target.value)
              }
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );
      }

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={typeof value === 'string' ? value : ''}
              onChange={(e) =>
                updateProperty(selectedElement!.elementId, property.id, e.target.value)
              }
              placeholder="https://example.com/image.jpg"
            />
            {value && typeof value === 'string' && (
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
              />
            )}
          </div>
        );

      case 'number':
      case 'fontSize':
      case 'spacing':
      case 'borderRadius':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Slider
                value={[typeof value === 'number' ? value : (property.min || 0)]}
                onValueChange={(values) =>
                  updateProperty(selectedElement!.elementId, property.id, values[0])
                }
                min={property.min || 0}
                max={property.max || 100}
                step={property.step || 1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-16 text-right">
                {typeof value === 'number' ? value : 0}
                {property.unit || ''}
              </span>
            </div>
          </div>
        );

      case 'select': {
        const options = property.options ?? [];
        const optionKey = (index: number) => `${property.id}-${index}`;
        const activeIndex = options.findIndex((option) => option.value === value);
        const selectValue = activeIndex >= 0 ? optionKey(activeIndex) : '';

        const handleSelectChange = (key: string) => {
          const selectedIndex = options.findIndex((_, index) => optionKey(index) === key);
          const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
          const nextValue = (selectedOption?.value ?? key) as PropertyValue;

          updateProperty(selectedElement!.elementId, property.id, nextValue);
        };

        return (
          <Select value={selectValue} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder={property.label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={optionKey(index)} value={optionKey(index)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      default:
        return null;
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'text':
        return <TextT className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {selectedElement && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-20 right-4 z-[100] w-96"
        >
          <Card
            className={cn(
              'transition-[background,box-shadow,border-color] duration-500',
              panelToneClasses[saveState]
            )}
          >
            {/* Header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedElement.category)}
                  <h3 className="font-semibold">{selectedElement.elementLabel}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => selectElement(null)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedElement.elementType}
              </Badge>
            </div>

            {/* Properties Editor */}
            <ScrollArea className="h-[calc(100vh-300px)] max-h-[500px]">
              <div className="p-4 space-y-4">
                {selectedElement.properties.map((property) => (
                  <div key={property.id} className="space-y-2">
                    <Label className="text-sm font-medium">{property.label}</Label>
                    {renderPropertyEditor(property)}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Action Buttons */}
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="flex-1 gap-2"
                >
                  <ArrowCounterClockwise className="w-4 h-4" />
                  Deshacer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex-1 gap-2"
                >
                  <ArrowClockwise className="w-4 h-4" />
                  Rehacer
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1 gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Reiniciar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 gap-2"
                  disabled={saveState === 'saving'}
                >
                  {saveState === 'saving' ? (
                    <CircleNotch className="w-4 h-4 animate-spin" />
                  ) : (
                    <FloppyDisk className="w-4 h-4" />
                  )}
                  {saveState === 'saving'
                    ? 'Guardando...'
                    : saveState === 'success'
                      ? 'Guardado'
                      : 'Guardar'}
                </Button>
              </div>
              {saveState !== 'idle' && (
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  {saveState === 'saving' && (
                    <CircleNotch className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                  {saveState === 'success' && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                  {saveState === 'error' && (
                    <WarningCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-muted-foreground">
                    {saveState === 'saving' && 'Guardando tus personalizaciones...'}
                    {saveState === 'success' && 'Cambios guardados exitosamente.'}
                    {saveState === 'error' && 'Ocurrió un error al guardar. Reintenta.'}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
