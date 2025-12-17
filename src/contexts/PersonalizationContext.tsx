'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import type {
  PersonalizationState,
  PersonalizationAction,
  EditableElementConfig,
  PropertyValue
} from '@/lib/personalization-types';

const STORAGE_KEY = 'personalization-customizations';

const initialState: PersonalizationState = {
  isEditMode: false,
  selectedElement: null,
  customizations: {},
  history: [{}],
  historyIndex: 0
};

function personalizationReducer(
  state: PersonalizationState,
  action: PersonalizationAction
): PersonalizationState {
  switch (action.type) {
    case 'SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: typeof action.payload === 'boolean' ? action.payload : false,
        selectedElement: (typeof action.payload === 'boolean' && action.payload) ? state.selectedElement : null
      };

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: (action.payload && typeof action.payload === 'object' && 'elementId' in action.payload) ? action.payload as EditableElementConfig : null
      };

    case 'UPDATE_PROPERTY': {
      if (!action.payload || typeof action.payload !== 'object' || !('elementId' in action.payload)) {
        return state;
      }
      const { elementId, propertyId, value } = action.payload as { elementId: string; propertyId: string; value: PropertyValue };
      const newCustomizations = {
        ...state.customizations,
        [elementId]: {
          ...(state.customizations[elementId] || {}),
          [propertyId]: value
        }
      };

      // Add to history for undo/redo
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newCustomizations);

      return {
        ...state,
        customizations: newCustomizations,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          customizations: state.history[newIndex],
          historyIndex: newIndex
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          customizations: state.history[newIndex],
          historyIndex: newIndex
        };
      }
      return state;
    }

    case 'RESET':
      return {
        ...state,
        customizations: {},
        history: [{}],
        historyIndex: 0,
        selectedElement: null
      };

    case 'LOAD_CUSTOMIZATIONS': {
      const customizations = (action.payload && typeof action.payload === 'object' && !('elementId' in action.payload)) 
        ? action.payload as Record<string, Record<string, PropertyValue>>
        : {};
      return {
        ...state,
        customizations,
        history: [customizations],
        historyIndex: 0
      };
    }

    default:
      return state;
  }
}

interface PersonalizationContextType {
  state: PersonalizationState;
  setEditMode: (enabled: boolean) => void;
  selectElement: (element: EditableElementConfig | null) => void;
  updateProperty: (elementId: string, propertyId: string, value: PropertyValue) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  saveCustomizations: () => void;
  getCustomization: <T extends PropertyValue>(elementId: string, propertyId: string, defaultValue: T) => T;
}

const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(personalizationReducer, initialState);

  // Load customizations from server on mount
  useEffect(() => {
    async function loadCustomizations() {
      try {
        const response = await fetch('/api/personalizations');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'LOAD_CUSTOMIZATIONS', payload: data.customizations });
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const customizations = JSON.parse(saved);
            dispatch({ type: 'LOAD_CUSTOMIZATIONS', payload: customizations });
          }
        }
      } catch (error) {
        console.error('Failed to load customizations from server:', error);
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const customizations = JSON.parse(saved);
            dispatch({ type: 'LOAD_CUSTOMIZATIONS', payload: customizations });
          }
        } catch (localError) {
          console.error('Failed to load customizations from localStorage:', localError);
        }
      }
    }
    loadCustomizations();
  }, []);

  const setEditMode = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_EDIT_MODE', payload: enabled });
  }, []);

  const selectElement = useCallback((element: EditableElementConfig | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: element });
  }, []);

  const updateProperty = useCallback((elementId: string, propertyId: string, value: PropertyValue) => {
    dispatch({ type: 'UPDATE_PROPERTY', payload: { elementId, propertyId, value } });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const reset = useCallback(async () => {
    dispatch({ type: 'RESET' });
    try {
      await fetch('/api/personalizations', { method: 'DELETE' });
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear customizations from server:', error);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (localError) {
        console.error('Failed to clear customizations from localStorage:', localError);
      }
    }
  }, []);

  const saveCustomizations = useCallback(async () => {
    try {
      const response = await fetch('/api/personalizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customizations: state.customizations })
      });
      
      if (!response.ok) {
        throw new Error('Server save failed');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customizations));
    } catch (error) {
      console.error('Failed to save customizations to server:', error);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customizations));
      } catch (localError) {
        console.error('Failed to save customizations to localStorage:', localError);
      }
    }
  }, [state.customizations]);

  const getCustomization = useCallback(
    <T extends PropertyValue>(elementId: string, propertyId: string, defaultValue: T): T => {
      const customValue = state.customizations[elementId]?.[propertyId];
      return (customValue !== undefined ? customValue : defaultValue) as T;
    },
    [state.customizations]
  );

  return (
    <PersonalizationContext.Provider
      value={{
        state,
        setEditMode,
        selectElement,
        updateProperty,
        undo,
        redo,
        reset,
        saveCustomizations,
        getCustomization
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return context;
}
