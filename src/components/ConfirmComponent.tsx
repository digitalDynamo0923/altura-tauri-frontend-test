import { useEffect, useState } from "react";

export default function ConfirmComponent({
  setStep,
  mnemonic,
  wallet,
}: {
  setStep: (step: STEPS) => void;
  mnemonic: string;
  wallet?: WALLET;
}) {
  const [randomArray, setRandomArray] = useState<number[]>([]);
  const [state, setState] = useState<{ [key: string]: string }>({});

  const getRandom = () => {
    const randomArray: number[] = [];
    while (randomArray.length < 3) {
      const random = Math.floor(Math.random() * 12);
      if (!randomArray.includes(random)) {
        randomArray.push(random);
      }
    }
    return randomArray;
  };

  useEffect(() => {
    setRandomArray(getRandom);
  }, []);

  const handleConfirm = () => {
    console.log(state);
    let passed = true;
    Object.entries(state).forEach(([key, value]) => {
      const menmonicArray = mnemonic.split(" ").slice(0, 12);
      if (menmonicArray[parseInt(key)] !== value) passed = false;
    });
    if (passed) setStep("PWD");
    else {
      setRandomArray(getRandom());
      setState({});
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-5 gap-y-2">
        {mnemonic
          .split(" ")
          .slice(0, 12)
          .map((word: string, index: number) => {
            console.log(randomArray);
            if (randomArray.includes(index))
              return (
                <input
                  type="text"
                  key={`${word}_${index}`}
                  className="border border-primary px-4 py-2 rounded"
                  name={index.toString()}
                  value={state[index.toString()] || ""}
                  onChange={(e) =>
                    setState({ ...state, [index.toString()]: e.target.value })
                  }
                />
              );
            return (
              <div
                className="border border-primary px-4 py-2 rounded"
                key={`${word}_${index}`}
              >
                {word}
              </div>
            );
          })}
      </div>
      <div className="flex space-x-5 justify-center mt-10">
        <button
          className="primary"
          onClick={() => setStep(wallet === "CREATE" ? "MNEMONIC" : "IMPORT")}
        >
          Back
        </button>
        <button className="secondary" onClick={() => handleConfirm()}>
          Confirm
        </button>
      </div>
    </div>
  );
}
