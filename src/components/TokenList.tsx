import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useTokens } from "../providers/TokensProvider";
import TokenAddBtn from "./TokenAddBtn";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import IERC20 from "../ABI/IERC20.json";
import { useWallet } from "../providers/WalletProvider";

export default function TokenList() {
  const { tokens } = useTokens();

  return (
    <div className="grow relative my-5">
      <div className="max-w-[450px] mx-auto border border-slate-700 h-full">
        <div className="pb-10 h-full overflow-auto">
          {tokens.map((token) => (
            <TokenListItem token={token} key={token.address} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-center items-center">
          <TokenAddBtn />
        </div>
      </div>
    </div>
  );
}

const TokenListItem = ({ token }: { token: TOKEN }) => {
  const [balance, setBalance] = useState<string>("...");
  const { state } = useWallet();

  useEffect(() => {
    (async () => {
      const provider = new ethers.InfuraProvider("mainnet");
      const tokenContract = new ethers.Contract(
        token.address,
        IERC20,
        provider
      );
      let weiBalance;
      if (token.address === "0x0000000000000000000000000000000000000000") {
        weiBalance = await provider.getBalance(state[1] as string);
      } else {
        weiBalance = await tokenContract.balanceOf(state[1]);
      }
      setBalance(ethers.formatEther(weiBalance));
    })();
  }, []);

  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-slate-700">
      <div className="flex space-x-3">
        <Jazzicon diameter={24} seed={jsNumberForAddress(token.address)} />
        <p>{token.name}</p>
      </div>
      <div className="text-sm">
        {balance}&nbsp;
        {token.symbol}
      </div>
    </div>
  );
};
