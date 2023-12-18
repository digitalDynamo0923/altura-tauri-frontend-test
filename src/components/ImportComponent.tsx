import { useState } from "react";

export default function ImportComponent({
  setStep,
  setMnemonic,
}: {
  setStep: (step: STEPS) => void;
  setMnemonic: (newMenomic: string) => void;
}) {
  const [phase, setPhase] = useState<string>("");

  return (
    <div>
      <div className="w-full max-w-[400px] mx-auto">
        <textarea
          name=""
          id=""
          rows={5}
          className="w-full border rounded resize-none p-3 bg-transparent focus:outline-none"
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
            setStep("CONFIRM");
            setMnemonic(phase);
          }}
          disabled={phase.split(" ").length !== 12}
        >
          Next
        </button>
      </div>
    </div>
  );
}
