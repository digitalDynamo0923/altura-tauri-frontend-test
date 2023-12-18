import { useState } from "react";
import { Store } from "tauri-plugin-store-api";
import CryptoJS from "crypto-js";
import logo from "./assets/logo.webp";
import { derive } from "./tauri";
import { useWallet } from "./providers/WalletProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [pwd, setPwd] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const { setState } = useWallet();
  const navigate = useNavigate();
  const store = new Store(".settings.dat");

  const handleLogin = async () => {
    const encrypted = await store.get("wallet");
    if (encrypted) {
      const bytes = CryptoJS.AES.decrypt(encrypted as string, pwd);
      const data = bytes.toString(CryptoJS.enc.Utf8);
      if (data) {
        console.log(data.slice(1, -1));
        const res = await derive(data.slice(1, -1));
        if (res.success) {
          const result = res.result as (string | KeyPair)[];
          console.log(result);
          setError(undefined);
          setState(result);
          navigate("/dashboard");
        } else {
          setError("Something went wrong, Please try again later.");
        }
      } else {
        setError("Wrong password");
      }
    }
  };

  const disabled = pwd.length < 8;

  return (
    <div className="max-w-[1440px] relative w-full mx-auto h-screen">
      <div className="absolute center px-6 md:px-10 py-10 w-full max-w-[600px] h-[600px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <img src={logo} alt="logo" />
          <h1 className="text-center text-3xl font-semibold uppercase mt-7 bg-gradient-to-r from-[#C623FF] to-[#0AF1FF] bg-clip-text text-transparent">
            Altura Wallet
          </h1>
        </div>
        <div>
          <div className="w-full max-w-[400px] mx-auto">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <label htmlFor="pwd" className="mt-3 mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="pwd"
              id="pwd"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full rounded px-3 py-2"
            />
          </div>
          <div className="flex space-x-5 justify-center mt-10">
            <button
              className="primary disabled:opacity-30"
              onClick={() => handleLogin()}
              disabled={disabled}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
