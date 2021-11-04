import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import PolyToken from "../artifacts/contracts/PolyToken.sol/PolyToken.json";

const DataContext = createContext<DataContextProps | null>(null);

export const DataProvider = ({ children }) => {
  const data = useProviderData();

  return <DataContext value={data}>{children}</DataContext>;
};

export const useData = () => useContext<DataContextProps | null>(DataContext);


export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();
  const [polyToken, setPolyToken] = useState();
  const [balance, setBalance] = useState();

  const loadWallet = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      var allAccounts = await web3.eth.getAccounts();
      setAccount(allAccounts[0]);

      const polyTokenData = polyToken.networks["80001"];
      if (polyTokenData) {
        var polyTokenInstance = new web3.eth.Contract(
          PolyToken.abi,
          polyTokenData.address
        );
        setPolyToken(polyTokenInstance);
        var bal = await polyTokenInstance.methods
          .balanceOf(allAccounts[0])
          .call();
        setBalance(bal);
      } else {
        window.alert("TestNet not found");
      }
      setLoading(false);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
    }
  };

  const sendPayment = async ({ amount, toAddress }) => {
    try {
      const amountInWei = window.web3.utils.toWei(amount, "ether");
      var bal = await polyToken.methods.balanceOf(account).call();
      if (bal < amountInWei) {
        return "You don't have enough balance";
      }
      const txHash = await polyToken.methods
        .transfer(toAddress, amountInWei)
        .send({
          from: account,
        });
      var bal = await polyToken.methods.balanceOf(account).call();
      setBalance(bal);
      return "Payment success";
    } catch (e) {
      return e.message;
    }
  };

  return {
    account,
    loading,
    loadWallet,
    sendPayment,
    balance,
  };
};
