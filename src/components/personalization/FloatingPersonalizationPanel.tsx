'use client';

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
import {
  X,
  FloppyDisk,
  ArrowCounterClockwise,
  ArrowClockwise,
  Trash,
  Palette,
  TextT,
  Image as ImageIcon
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { EditableProperty } from '@/lib/personalization-types';

export function FloatingPersonalizationPanel() {
  const { state, selectElement, updateProperty, undo, redo, reset, saveCustomizations } =
    usePersonalization();
  const { selectedElement, historyIndex, history } = state;

  const handleSave = () => {
    saveCustomizations();
    toast.success('¡Cambios guardados exitosamente!');
  };

  const handleReset = () => {
    reset();
    toast.success('Personalizaciones reiniciadas');
  };

  const renderPropertyEditor = (property: EditableProperty) => {
    const value = property.value;

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={typeof value === 'string' ? value : String(value || '')}
            onChange={(e) =>
              updateProperty(selectedElement!.elementId, property.id, e.target.value)
            }
            placeholder={property.label}
          />
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={typeof value === 'string' ? value : '#000000'}
              onChange={(e) =>
                updateProperty(selectedElement!.elementId, property.id, e.target.value)
              }
              className="w-16 h-10 cursor-pointer"
            />
            <Input
              value={typeof value === 'string' ? value : '#000000'}
              onChange={(e) =>
                updateProperty(selectedElement!.elementId, property.id, e.target.value)
              }
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

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

      case 'select':
        return (
          <Select
            value={String(value || '')}
            onValueChange={(val) => updateProperty(selectedElement!.elementId, property.id, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={property.label} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

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
          <Card className="shadow-2xl border-2">
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
                <Button size="sm" onClick={handleSave} className="flex-1 gap-2">
                  <FloppyDisk className="w-4 h-4" />
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
