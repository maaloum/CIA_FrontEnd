import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
  isHeaderVisible: boolean;
  hideHeader: () => void;
  showHeader: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const hideHeader = () => setIsHeaderVisible(false);
  const showHeader = () => setIsHeaderVisible(true);

  return (
    <HeaderContext.Provider value={{ isHeaderVisible, hideHeader, showHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
