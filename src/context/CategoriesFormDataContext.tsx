import { createContext, useContext, useState, ReactNode } from 'react';
import { CreateToyProps } from '../components/common/form/types';

interface FormDataContextType {
  data: CreateToyProps | null;
  setData: (data: CreateToyProps | null) => void;
}

const CategoriesFormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(CategoriesFormDataContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormDataProvider');
  }
  return context;
};

export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CreateToyProps | null>(null);

  return (
    <CategoriesFormDataContext.Provider value={{ data, setData }}>
      {children}
    </CategoriesFormDataContext.Provider>
  );
};
