import { useState } from "react";

export default function PwdComponent({
  setStep,
  createWallet,
  wallet,
}: {
  setStep: (step: STEPS) => void;
  createWallet: (pwd: string) => void;
  wallet?: WALLET;
}) {
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
          className="w-full border rounded px-3 py-2 bg-transparent"
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
          className="w-full border rounded px-3 py-2 bg-transparent"
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
}
