import React, { createContext, useContext, useCallback, useState } from 'react';
import { v4 } from 'uuid';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessages {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessages, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContex = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessages[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessages, 'id'>) => {
      const id = v4();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages(state => [...state, toast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContex.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContex.Provider>
  );
};

function useToast() {
  const context = useContext(ToastContex);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
