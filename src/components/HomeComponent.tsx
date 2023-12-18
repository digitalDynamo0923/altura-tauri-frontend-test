export default function HomeComponent({
  setStep,
  setWallet,
}: {
  setStep: (step: STEPS) => void;
  setWallet: (wallet: WALLET) => void;
}) {
  return (
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
}
