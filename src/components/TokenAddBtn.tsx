import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Fragment, useState } from "react";
import { RxPlus } from "react-icons/rx";
import IERC20 from "../ABI/IERC20.json";
import { useTokens } from "../providers/TokensProvider";
import { Store } from "tauri-plugin-store-api";

export default function TokenAddBtn() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>("");
  const { tokens, setTokens } = useTokens();
  const store = new Store(".settings.dat");

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setError(undefined);
    }, 500);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function addToken() {
    if (tokens.some((token) => token.address === address))
      setError("Token already exists");
    else {
      setIsLoading(true);
      try {
        const provider = new ethers.InfuraProvider("mainnet");
        const tokenContract = new ethers.Contract(address, IERC20, provider);
        const symbolPromise = tokenContract.symbol();
        const namePromise = tokenContract.name();
        const decimalsPromise = tokenContract.decimals();
        const [symbol, name, decimals] = await Promise.all([
          symbolPromise,
          namePromise,
          decimalsPromise,
        ]);
        const updatedTokens = [
          ...tokens,
          { address, symbol, name, decimals: decimals.toString() },
        ];
        await store.set("tokens", JSON.stringify(updatedTokens));
        await store.save();
        setTokens(updatedTokens);
        setIsOpen(false);
      } catch (err) {
        setError((err as Error).message);
      }
      setAddress("");
      setIsLoading(false);
    }
  }

  return (
    <>
      <div
        className="flex items-center justify-center space-x-5 cursor-pointer"
        onClick={openModal}
      >
        <RxPlus /> Add token
      </div>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="font-medium leading-6">
                    Enter Token Address
                  </Dialog.Title>
                  {error && (
                    <p className="text-red-400 mt-3 text-sm">{error}</p>
                  )}
                  <div className="mt-2">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="w-full px-3 py-2 rounded border border-primary"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="primary"
                      disabled={isLoading}
                      onClick={() => addToken()}
                    >
                      {isLoading ? "..." : "Add"}
                    </button>
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
}
