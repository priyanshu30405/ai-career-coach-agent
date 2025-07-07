'use client';

import React, { createContext, useCallback, useState } from 'react';

interface UsageContextType {
  usageRefreshToken: number;
  refreshUsage: () => void;
}

export const UsageContext = createContext<UsageContextType>({
  usageRefreshToken: 0,
  refreshUsage: () => {},
});

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usageRefreshToken, setUsageRefreshToken] = useState(0);

  const refreshUsage = useCallback(() => {
    setUsageRefreshToken((prev) => prev + 1);
  }, []);

  return (
    <UsageContext.Provider value={{ usageRefreshToken, refreshUsage }}>
      {children}
    </UsageContext.Provider>
  );
}; 