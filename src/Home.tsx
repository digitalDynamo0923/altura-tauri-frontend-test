import { useEffect, useLayoutEffect, useState } from "react";
import { RxReload, RxCopy, RxCheckCircled } from "react-icons/rx/";
import { derive, generate } from "./tauri";
import { useNavigate } from "react-router-dom";
import { KeyPair, useWallet } from "./WalletProvider";
import { Store } from "tauri-plugin-store-api";
import CryptoJS from "crypto-js";
import logo from "./assets/logo.webp";

type STEPS = "HOME" | "MNEMONIC" | "PWD" | "IMPORT";
type WALLET = "CREATE" | "IMPORT";

function App() {
  const [step, setStep] = useState<STEPS>("HOME");
  const [wallet, setWallet] = useState<WALLET | undefined>(undefined);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { setState } = useWallet();
  const navigete = useNavigate();
  const store = new Store(".settings.dat");

  useLayoutEffect(() => {
    (async () => {
      const encrypted = await store.get("wallet");
      if (encrypted) {
        // navigete("/login");
      }
    })();
  }, []);

  const createWallet = async (pwd: string) => {
    const response = await derive(mnemonic);
    if (response.success) {
      const result = response.result as [string | KeyPair];
      setState(result);

      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(mnemonic),
        pwd
      ).toString();

      await store.set("wallet", encrypted);
      await store.save();

      setShowAlert(true);
      setTimeout(() => {
        navigete("/dashboard");
      }, 3000);
    } else {
      console.log(response.message);
    }
  };

  const renderComponents = () => {
    switch (step) {
      case "HOME":
        return <HomeComponent setStep={setStep} setWallet={setWallet} />;
      case "MNEMONIC":
        return (
          <MnemonicComponent
            mnemonic={mnemonic}
            setStep={setStep}
            setMnemonic={setMnemonic}
          />
        );
      case "IMPORT":
        return <ImportComponent setStep={setStep} setMnemonic={setMnemonic} />;
      case "PWD":
        return (
          <PwdComponent
            setStep={setStep}
            createWallet={createWallet}
            wallet={wallet}
          />
        );

      default:
        break;
    }
  };

  return (
    <div className="max-w-[1440px] relative w-full mx-auto h-screen">
      <div className="absolute center px-6 md:px-10 py-10 w-full max-w-[600px] h-[600px] flex flex-col justify-between">
        <div className="flex flex-col items-center mt-10">
          <img src={logo} alt="logo" />
          <h1 className="text-center text-3xl font-semibold uppercase mt-7 bg-gradient-to-r from-[#C623FF] to-[#0AF1FF] bg-clip-text text-transparent">
            Altura Wallet
          </h1>
        </div>
        {renderComponents()}
      </div>
      {showAlert && (
        <div className="absolute top-3 right-3 rounded bg-slate-300 shadow px-4 py-2">
          {wallet === "CREATE"
            ? "Wallet created successfully!"
            : "Wallet imported successfully!"}
        </div>
      )}
    </div>
  );
}

export default App;

const HomeComponent = ({
  setStep,
  setWallet,
}: {
  setStep: (step: STEPS) => void;
  setWallet: (wallet: WALLET) => void;
}) => (
  <div className="flex space-x-5 justify-center">
    <button
      className="primary"
      onClick={() => {
        setStep("MNEMONIC");
        setWallet("CREATE");
      }}
    >
      Create wallet
    </button>
    <button
      className="secondary"
      onClick={() => {
        setStep("IMPORT");
        setWallet("IMPORT");
      }}
    >
      Import wallet
    </button>
  </div>
);

const MnemonicComponent = ({
  setStep,
  mnemonic,
  setMnemonic,
}: {
  mnemonic: string;
  setStep: (step: STEPS) => void;
  setMnemonic: (newMenomic: string) => void;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    refreshMnemonic();
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
              className="border border-slate-700 px-4 py-2 rounded"
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
        <button className="secondary" onClick={() => setStep("PWD")}>
          Next
        </button>
      </div>
    </div>
  );
};

const ImportComponent = ({
  setStep,
  setMnemonic,
}: {
  setStep: (step: STEPS) => void;
  setMnemonic: (newMenomic: string) => void;
}) => {
  const [phase, setPhase] = useState<string>("");

  return (
    <div>
      <div className="w-full max-w-[400px] mx-auto">
        <textarea
          name=""
          id=""
          rows={5}
          className="w-full border border-slate-700 rounded resize-none p-3"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
        ></textarea>
      </div>
      <div className="flex space-x-5 justify-center mt-10">
        <button className="primary" onClick={() => setStep("HOME")}>
          Back
        </button>
        <button
          className="secondary disabled:opacity-30"
          onClick={() => {
            setStep("PWD");
            setMnemonic(phase);
          }}
          disabled={phase.split(" ").length !== 12}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const PwdComponent = ({
  setStep,
  createWallet,
  wallet,
}: {
  setStep: (step: STEPS) => void;
  createWallet: (pwd: string) => void;
  wallet?: WALLET;
}) => {
  const [state, setState] = useState<{ pwd: string; confPwd: string }>({
    pwd: "",
    confPwd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    if (!disabled) {
      createWallet(state.pwd);
    }
  };

  const disabled = state.pwd.length < 8 || state.pwd !== state.confPwd;

  return (
    <div>
      <div className="w-full max-w-[400px] mx-auto">
        <label htmlFor="pwd" className="mt-3 mb-1 block">
          Password
        </label>
        <input
          type="password"
          name="pwd"
          id="pwd"
          value={state.pwd}
          onChange={(e) => handleChange(e)}
          className="w-full border border-slate-700 rounded px-3 py-2"
        />
        <label htmlFor="confPwd" className="mt-3 mb-1 block">
          Confirm Password
        </label>
        <input
          type="password"
          name="confPwd"
          id="confPwd"
          value={state.confPwd}
          onChange={(e) => handleChange(e)}
          className="w-full border border-slate-700 rounded px-3 py-2"
        />
      </div>
      <div className="flex space-x-5 justify-center mt-10">
        <button
          className="primary"
          onClick={() => {
            wallet && wallet === "CREATE"
              ? setStep("MNEMONIC")
              : setStep("IMPORT");
          }}
        >
          Back
        </button>
        <button
          className="secondary disabled:opacity-30"
          onClick={() => handleClick()}
          disabled={disabled}
        >
          Create wallet
        </button>
      </div>
    </div>
  );
};
