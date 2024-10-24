import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GlobalState {
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <GlobalStateContext.Provider value={{ isLoading, error, setIsLoading, setError }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};