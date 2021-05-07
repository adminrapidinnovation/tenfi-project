import { fetchAssetsPoolData } from "contract/ContractMethods";
import { updatePoolData } from "redux/actions/user.actions";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

export const refreshPoolData = async (address, dispatch) => {
  try {
    const res = await fetchAssetsPoolData(address);
    if (!!res && typeof res !== "undefined") {
      dispatch(updatePoolData(res));
    }
  } catch (error) {}
};

export function commaFy(num) {
  var str = num.toString().split(".");
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  return str.join(".");
}

export const getWeb3Instance = async (type) => {
  let web3 = new Web3(Web3.givenProvider);
  if (parseInt(type) === 1) {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        web3.eth.setProvider(provider);
      } else {
        window.alert("Please activate MetaMask first.");
      }
    } catch (error) {}
  }
  if (parseInt(type) === 2) {
    try {
      const provider = await window.BinanceChain;
      if (provider) {
        web3.setProvider(provider);
      }
    } catch (error) {}
  }
  return web3;
};
