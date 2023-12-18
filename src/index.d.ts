type STEPS = "HOME" | "MNEMONIC" | "PWD" | "IMPORT" | "CONFIRM";
type WALLET = "CREATE" | "IMPORT";
type TOKEN = {
  address: string;
  symbol: string;
  name: string;
  decimals: string;
};
type KeyPair = {
  private: string;
  public: string;
  ext_private: string;
  ext_public: string;
  seed: number[];
};
