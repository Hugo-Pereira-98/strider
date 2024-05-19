import Cookies from 'js-cookie';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: any;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const posterrID = Cookies.get('posterr-id');
    if (posterrID) {
      const session = JSON.parse(posterrID);
      if (session?.sidebarCollapsed !== undefined) {
        setIsCollapsed(session?.sidebarCollapsed);
      }
    } else {
      setIsCollapsed(true);
    }
  }, []);

  return (
    <>
      {isCollapsed !== null && (
        <SidebarContext.Provider
          value={{ sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }}
        >
          {children}
        </SidebarContext.Provider>
      )}
    </>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
