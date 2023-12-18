import { useEffect, useState } from "react";
import { generate } from "../tauri";
import { RxCheckCircled, RxCopy, RxReload } from "react-icons/rx";

export default function MnemonicComponent({
  setStep,
  mnemonic,
  setMnemonic,
}: {
  mnemonic: string;
  setStep: (step: STEPS) => void;
  setMnemonic: (newMenomic: string) => void;
}) {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!mnemonic) {
      refreshMnemonic();
    }
  }, []);

  const copyMnemonic = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const refreshMnemonic = async () => {
    const newMnemonic = await generate();
    console.log(newMnemonic);
    setMnemonic(newMnemonic);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-5 gap-y-2">
        {mnemonic
          .split(" ")
          .slice(0, 12)
          .map((word: string, index: number) => (
            <div
              key={`${word}_${index}`}
              className="border border-primary px-4 py-2 rounded"
            >
              {word}
            </div>
          ))}
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <RxReload
          className="w-4 h-4 cursor-pointer"
          onClick={() => refreshMnemonic()}
        />
        {copied ? (
          <RxCheckCircled className="w-4 h-4" />
        ) : (
          <RxCopy
            className="w-4 h-4 cursor-pointer"
            onClick={() => copyMnemonic()}
          />
        )}
      </div>
      <div className="flex space-x-5 justify-center mt-10">
        <button className="primary" onClick={() => setStep("HOME")}>
          Back
        </button>
        <button className="secondary" onClick={() => setStep("CONFIRM")}>
          Next
        </button>
      </div>
    </div>
  );
}
