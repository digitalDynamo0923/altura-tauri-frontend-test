import React, { createContext, useContext, useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";
import { useWallet } from "./WalletProvider";

type State = TOKEN[];

type ContextType = {
  tokens: State;
  setTokens: (newState: State) => void;
};

const TokensContext = createContext<ContextType>({
  tokens: [],
  setTokens: () => {},
});

export const TokensProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<State>([]);
  const store = new Store(".settings.dat");
  const { state } = useWallet();

  useEffect(() => {
    (async () => {
      const tokens = await store.get("tokens");
      if (tokens) {
        setTokens(JSON.parse(tokens as string));
      }
    })();
  }, [state]);

  return (
    <TokensContext.Provider value={{ tokens, setTokens }}>
      {children}
    </TokensContext.Provider>
  );
};

export const useTokens = () => useContext(TokensContext) as ContextType;
