// import Web3EthContract from "web3-eth-contract";
// import Web3 from "web3";
// log
import { fetchData } from "../data/dataActions";
import { toast } from "react-toastify";
import { ethers } from "ethers";


const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      // Web3EthContract.setProvider(ethereum);

      // let web3 = new Web3(ethereum);
      let web3 = new ethers.providers.Web3Provider(ethereum);
      const signer = web3?.getSigner();
      const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, abi,signer);

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        if (networkId == CONFIG.NETWORK.ID) {
          // const SmartContractObj = new Web3EthContract(
          //   abi,
          //   CONFIG.CONTRACT_ADDRESS
          // );
      
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: contract,
              web3: web3,
            })
          );

          toast.success("Connected!");

          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          toast.error(`Change network to ${CONFIG.NETWORK.NAME}.`);
        }
      } catch (err) {
        
        toast.error("Something went wrong.");
      }
    } else {
      // toast.error("Install Metamask.");
      window.location.href='https://metamask.app.link/dapp/gymbros.nftnow.online/'
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};