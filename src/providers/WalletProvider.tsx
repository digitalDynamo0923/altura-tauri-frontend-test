import React, { createContext, useContext, useState } from "react";

type State = (string | KeyPair)[];

type ContextType = {
  state: State;
  setState: (newState: State) => void;
};

const WalletContext = createContext<ContextType>({
  state: [],
  setState: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<State>([]);

  return (
    <WalletContext.Provider value={{ state, setState }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext) as ContextType;
