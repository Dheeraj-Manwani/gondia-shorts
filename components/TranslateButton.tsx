import React from 'react';
import { useTranslate } from '@/hooks/use-translate';

const TranslateButton: React.FC = () => {
  const { isHindi, toggleLanguage } = useTranslate();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      aria-label={isHindi ? "Switch to English" : "Switch to Hindi"}
    >
      <span className="font-semibold text-sm">
        {isHindi ? "ENG" : "हिंदी"}
      </span>
    </button>
  );
};

export default TranslateButton;