import { useNavigate } from "react-router-dom";
import { useWallet } from "./WalletProvider";
import { useEffect, useState, Fragment } from "react";
import { ethers } from "ethers";
import TOKEN_ABI from "./IERC20.json";
import { RxCopy, RxLockClosed, RxReload } from "react-icons/rx";
import { Transition, Dialog } from "@headlessui/react";
import { Store } from "tauri-plugin-store-api";
import CryptoJS from "crypto-js";

export default function Dashboard() {
  const { state } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.length === 0) navigate("/");
    getBalance();
  }, []);

  const getBalance = async () => {
    setLoading(true);
    try {
      const contractAddress = import.meta.env.VITE_TOKEN_ADDRESS;
      const provider = new ethers.JsonRpcProvider(
        `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}111`
      );
      const contract = new ethers.Contract(
        contractAddress,
        TOKEN_ABI,
        provider
      );
      const symbol = await contract.symbol();
      const weiBalance = await contract.balanceOf(state[1]);
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
              <div className="flex justify-center items-center space-x-5 mt-3">
                <p className="text-center text-xs">
                  {(state[1] as string).slice(0, 5)}...$
                  {(state[1] as string).slice(-5)}
                </p>
                <RxCopy
                  className="w-3 h-3 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(state[1] as string)
                  }
                />
              </div>
            </>
          )}
          <p className="text-center mt-10">Balance</p>
          <div className="flex justify-center items-center space-x-5 mt-3">
            <h1 className="text-center text-3xl font-semibold uppercase">
              {balance} {symbol}
            </h1>
            {loading ? (
              <span>...</span>
            ) : (
              <RxReload
                className="w-3 h-3 cursor-pointer"
                onClick={() => getBalance()}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <ShowMnemonicBtn />
        </div>
      </div>
      <LockBtn />
      {error && (
        <div className="absolute top-3 right-3 rounded bg-slate-300 shadow px-4 py-2">
          {error}
        </div>
      )}
    </div>
  );
}

const ShowMnemonicBtn = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pwd, setPwd] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [mnemonic, setMnemonic] = useState<string | undefined>(undefined);
  const store = new Store(".settings.dat");

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setMnemonic(undefined);
      setError(undefined);
      setPwd("");
    }, 500);
  }

  function openModal() {
    setIsOpen(true);
  }

  const showMnemonics = async () => {
    const encrypted = await store.get("wallet");
    console.log(encrypted);
    if (encrypted && pwd && pwd.length >= 8) {
      const bytes = CryptoJS.AES.decrypt(encrypted as string, pwd);
      const data = bytes.toString(CryptoJS.enc.Utf8);
      if (data) {
        setMnemonic(data.slice(1, -1));
      } else {
        setError("Wrong password!");
      }
    } else {
      if (!encrypted) setError("Something went wrong, please try again later!");
      else setError("Wrong password!");
    }
  };

  return (
    <>
      <button className="secondary" onClick={openModal}>
        Show Mnemonic Phase
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="font-medium leading-6 text-gray-900"
                  >
                    {mnemonic ? "Your Mnemonic phase" : "Enter your password"}
                  </Dialog.Title>
                  <div className="mt-2">
                    {mnemonic ? (
                      <textarea
                        className="w-full rounded border border-slate-700 resize-none p-3"
                        defaultValue={mnemonic}
                      ></textarea>
                    ) : (
                      <>
                        {error && (
                          <p className="text-red-400 text-sm">{error}</p>
                        )}
                        <input
                          type="password"
                          name="pwd"
                          id="pwd"
                          className="w-full px-3 py-2 rounded border border-slate-700"
                          value={pwd}
                          onChange={(e) => setPwd(e.target.value)}
                        />
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {!mnemonic && (
                      <button
                        type="button"
                        className="primary"
                        onClick={() => showMnemonics()}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      type="button"
                      className="secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const LockBtn = () => {
  const navigate = useNavigate();
  const { setState } = useWallet();

  const lockWallet = () => {
    setState([]);
    navigate("/");
  };

  return (
    <button onClick={() => lockWallet()} className="absolute top-5 right-5">
      <RxLockClosed className="w-4 h-4" />
    </button>
  );
};
