import { useLayoutEffect, useState } from "react";
import { derive } from "./tauri";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./providers/WalletProvider";
import { Store } from "tauri-plugin-store-api";
import CryptoJS from "crypto-js";
import logo from "./assets/logo.webp";
import HomeComponent from "./components/HomeComponent";
import MnemonicComponent from "./components/MnemonicComponent";
import ConfirmComponent from "./components/ConfirmComponent";
import ImportComponent from "./components/ImportComponent";
import PwdComponent from "./components/PwdComponent";

function App() {
  const [step, setStep] = useState<STEPS>("HOME");
  const [wallet, setWallet] = useState<WALLET | undefined>(undefined);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { setState } = useWallet();
  const navigate = useNavigate();
  const store = new Store(".settings.dat");

  useLayoutEffect(() => {
    (async () => {
      const encrypted = await store.get("wallet");
      if (encrypted) {
        navigate("/login");
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
        navigate("/dashboard");
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
      case "CONFIRM":
        return (
          <ConfirmComponent
            setStep={setStep}
            mnemonic={mnemonic}
            wallet={wallet}
          />
        );
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
        <div className="flex flex-col items-center">
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
