// src/context/FormDataContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { CreateToyProps } from '../components/common/form/types';

interface FormDataContextType {
  data: CreateToyProps | null;
  setData: (data: CreateToyProps | null) => void;
}

const ToyFormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(ToyFormDataContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormDataProvider');
  }
  return context;
};

export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CreateToyProps | null>(null);

  return (
    <ToyFormDataContext.Provider value={{ data, setData }}>
      {children}
    </ToyFormDataContext.Provider>
  );
};
