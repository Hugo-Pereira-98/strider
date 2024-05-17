import React, { createContext, useContext, useEffect, useState } from 'react';

interface SessionContextType {
  isSessionActive: boolean;
  setIsSessionActive: (isActive: boolean) => void;
  isCleaned: boolean;
}

const SessionContext = createContext<SessionContextType>({
  isCleaned: false,
  isSessionActive: false,
  setIsSessionActive: () => {},
});

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isCleaned, setIsCleaned] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem('isCleaned')) {
      const keysToClear = [
        'gondola-recentCompanies',
        'gondola-indications',
        'gondola-institutional',
        'gondola-organizations',
      ];

      keysToClear.forEach((key) => {
        localStorage.removeItem(key);
      });

      sessionStorage.setItem('isCleaned', 'true');
      setIsCleaned(true);
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{ isCleaned, isSessionActive, setIsSessionActive }}
    >
      {children}
    </SessionContext.Provider>
  );
}
