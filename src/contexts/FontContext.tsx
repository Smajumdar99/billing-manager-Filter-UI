import React, { createContext, useContext, useState, useEffect } from 'react';

type Font = 'inter' | 'euclid' | 'manrope';

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<Font>(() => {
    const savedFont = localStorage.getItem('app-font');
    return (savedFont as Font) || 'inter';
  });

  useEffect(() => {
    localStorage.setItem('app-font', font);
    const fontFamily = {
      inter: 'Inter, sans-serif',
      euclid: 'Euclid Circular B, sans-serif',
      manrope: 'Manrope, sans-serif'
    }[font];
    document.documentElement.style.fontFamily = fontFamily;
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
} 