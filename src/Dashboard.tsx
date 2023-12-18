import { useNavigate } from "react-router-dom";
import { useWallet } from "./WalletProvider";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { RxCheckCircled, RxCopy, RxReload } from "react-icons/rx";
import LockBtn from "./components/LockBtn";
import ShowMnemonicBtn from "./components/ShowMnemonicBtn";
import ShowPrivateKeyBtn from "./components/ShowPrivateKeyBtn";
import AccountSelector from "./components/AccountSelector";

export default function Dashboard() {
  const { state } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.length === 0) navigate("/");
    getBalance();
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(state[1] as string);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const getBalance = async () => {
    setLoading(true);
    try {
      const provider = new ethers.InfuraProvider("mainnet");
      const weiBalance = await provider.getBalance(state[1] as string);
      const balance = ethers.formatEther(weiBalance);
      setBalance(balance);
      setSymbol(symbol);
    } catch (err) {
      setError("Connection failed! Try again later.");
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] relative w-full mx-auto h-screen">
      <div className="absolute center px-6 md:px-10 py-10 w-full max-w-[600px] h-[600px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          {state[1] && (
            <>
              <p className="text-center">Address</p>
              <div className="flex justify-center items-center space-x-5 mt-3 relative">
                <p className="text-center text-xs">
                  {(state[1] as string).slice(0, 5)}...
                  {(state[1] as string).slice(-5)}
                </p>
                <span className="absolute bottom-0 -right-6">
                  {copied ? (
                    <RxCheckCircled className="w-3 h-3" />
                  ) : (
                    <RxCopy
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => copyAddress()}
                    />
                  )}
                </span>
              </div>
            </>
          )}
          <p className="text-center mt-10">Balance</p>
          <div className="flex justify-center items-center space-x-5 mt-3 relative">
            <h1 className="text-center text-3xl font-semibold uppercase">
              {balance} ETH
            </h1>
            <span className="absolute bottom-0 -right-6">
              {loading ? (
                <span>...</span>
              ) : (
                <RxReload
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => getBalance()}
                />
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col space-y-3">
          <ShowMnemonicBtn />
          <ShowPrivateKeyBtn />
        </div>
      </div>
      {/* <AccountSelector /> */}
      <LockBtn />
      {error && (
        <div className="absolute top-3 right-3 rounded bg-slate-300 shadow px-4 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
