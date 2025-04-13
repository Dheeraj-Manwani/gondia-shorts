import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TranslateContextType {
  isHindi: boolean;
  toggleLanguage: () => void;
}

// Initialize with default values to avoid undefined
const TranslateContext = createContext<TranslateContextType>({
  isHindi: false,
  toggleLanguage: () => {}
});

export function TranslateProvider({ children }: { children: ReactNode }) {
  const [isHindi, setIsHindi] = useState(false);

  const toggleLanguage = () => {
    setIsHindi(prev => !prev);
  };

  return (
    <TranslateContext.Provider value={{ isHindi, toggleLanguage }}>
      {children}
    </TranslateContext.Provider>
  );
}

export function useTranslate() {
  return useContext(TranslateContext);
}