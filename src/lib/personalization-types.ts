export type EditablePropertyType =
  | 'color'
  | 'image'
  | 'number'
  | 'select'
  | 'fontSize'
  | 'spacing'
  | 'borderRadius';

export type PropertyValue = string | number | boolean;

export interface EditableProperty {
  id: string;
  label: string;
  type: EditablePropertyType;
  value: PropertyValue;
  options?: { label: string; value: PropertyValue }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface EditableElementConfig {
  elementId: string;
  elementLabel: string;
  elementType: string;
  properties: EditableProperty[];
  category?: 'header' | 'hero' | 'coupon' | 'button' | 'text' | 'image';
}

export interface PersonalizationState {
  isEditMode: boolean;
  selectedElement: EditableElementConfig | null;
  customizations: Record<string, Record<string, PropertyValue>>;
  history: Array<Record<string, Record<string, PropertyValue>>>;
  historyIndex: number;
}

export interface PersonalizationAction {
  type: 'SET_EDIT_MODE' | 'SELECT_ELEMENT' | 'UPDATE_PROPERTY' | 'UNDO' | 'REDO' | 'RESET' | 'LOAD_CUSTOMIZATIONS';
  payload?: boolean | EditableElementConfig | null | { elementId: string; propertyId: string; value: PropertyValue } | Record<string, Record<string, PropertyValue>>;
}
