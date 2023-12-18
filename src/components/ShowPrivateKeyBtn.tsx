import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Store } from "tauri-plugin-store-api";
import CryptoJS from "crypto-js";
import { useWallet } from "../providers/WalletProvider";

export default function ShowPrivateKeyBtn() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pwd, setPwd] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const store = new Store(".settings.dat");
  const { state } = useWallet();

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setPrivateKey(undefined);
      setError(undefined);
      setPwd("");
    }, 500);
  }

  function openModal() {
    setIsOpen(true);
  }

  const showPrivateKey = async () => {
    const encrypted = await store.get("wallet");
    console.log(encrypted);
    if (encrypted && pwd && pwd.length >= 8) {
      const bytes = CryptoJS.AES.decrypt(encrypted as string, pwd);
      const data = bytes.toString(CryptoJS.enc.Utf8);
      if (data) {
        setPrivateKey((state[0] as KeyPair).private);
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
        Show Private Key
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="font-medium leading-6">
                    {privateKey ? "Your Private Key" : "Enter your password"}
                  </Dialog.Title>
                  <div className="mt-2">
                    {privateKey ? (
                      <textarea
                        className="w-full rounded border border-primary resize-none p-3"
                        defaultValue={privateKey}
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
                          className="w-full px-3 py-2 rounded border border-primary"
                          value={pwd}
                          onChange={(e) => setPwd(e.target.value)}
                        />
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {!privateKey && (
                      <button
                        type="button"
                        className="primary"
                        onClick={() => showPrivateKey()}
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
}
