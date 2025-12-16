import { createContext, useState, useMemo } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({ sidebarOpen, setSidebarOpen }),
    [sidebarOpen]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

