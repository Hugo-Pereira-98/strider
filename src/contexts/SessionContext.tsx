import React, { createContext, useContext, useEffect, useState } from 'react';
import { openDB, populateDB, getUsers } from '@/utils/indexedDB';

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
    const initializeDB = async () => {
      const db = await openDB();
      const users = await getUsers(db);
      if (users.length === 0) {
        await populateDB(db);
      }
      setIsCleaned(true);
    };

    initializeDB();
  }, []);

  return (
    <SessionContext.Provider
      value={{ isCleaned, isSessionActive, setIsSessionActive }}
    >
      {children}
    </SessionContext.Provider>
  );
}
