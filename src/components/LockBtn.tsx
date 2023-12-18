import { useNavigate } from "react-router-dom";
import { useWallet } from "../providers/WalletProvider";
import { RxLockClosed } from "react-icons/rx";

export default function LockBtn() {
  const navigate = useNavigate();
  const { setState } = useWallet();

  const lockWallet = () => {
    setState([]);
    navigate("/");
  };

  return (
    <button onClick={() => lockWallet()} className="absolute top-5 right-5">
      <RxLockClosed className="w-4 h-4" />
    </button>
  );
}
