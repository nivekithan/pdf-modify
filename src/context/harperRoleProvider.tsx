import React, { createContext, useContext } from "react";
import { useMemo } from "react";

const harperUsername = createContext<string | null>(null);

const harperPassword = createContext<string | null>(null);

type HarperProviderProps = {
  userName: string;
  password: string;
  children: React.ReactNode;
};

export const HarperProvider = ({ userName, password, children }: HarperProviderProps) => {
  return (
    <harperUsername.Provider value={userName}>
      <harperPassword.Provider value={password}>{children}</harperPassword.Provider>
    </harperUsername.Provider>
  );
};

export const useHarperUser = () => {
  const userName = useContext(harperUsername);
  const password = useContext(harperPassword);

  return useMemo(() => ({ userName, password }), [userName, password]);
};
