import React, { createContext, useContext, useMemo, useState } from 'react';

type FaunaPediaContextValue = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FaunaPediaContext = createContext<FaunaPediaContextValue | undefined>(undefined);

export function FaunaPediaProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) }),
    [favorites]
  );

  return <FaunaPediaContext.Provider value={value}>{children}</FaunaPediaContext.Provider>;
}

export function useFaunaPedia() {
  const context = useContext(FaunaPediaContext);
  if (!context) throw new Error('useFaunaPedia harus digunakan di dalam FaunaPediaProvider');
  return context;
}
