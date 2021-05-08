import React from "react";
import { useDispatch } from "react-redux";
import { connectWallet, disconnectWallet } from "redux/actions/user.actions";
import styles from "../styles/modules/ConnectWalletModal.module.scss";
import Modal from "./Modal";
import { getWeb3Instance } from "global-function/globalFunction";

const items = [
  {
    type: 1,
    src: require("assets/images/Metamask-1.svg"),
    title: "MetaMask",
  },
  {
    type: 2,
    src: require("assets/images/BinanceChainWallet.png"),
    title: "Binance Chain Wallet",
  },
];

const ConnectWalletModal = ({ onClose, setUserData }) => {
  const dispatch = useDispatch();

  const handleLogin = async (web3, type) => {
    try {
      localStorage.setItem("walletType", type);
      const accounts = await web3.currentProvider.request({
        method: "eth_requestAccounts",
      });
      if (!!accounts && accounts.length > 0) {
        dispatch(connectWallet(accounts[0]));
      } else {
        dispatch(disconnectWallet());
      }
    } catch (error) {}
  };

  const handleWalletConnect = async (type) => {
    try {
      const web3 = await getWeb3Instance(type);
      handleLogin(web3, type);
    } catch (error) {
      dispatch(disconnectWallet());
    } finally {
      onClose();
    }
  };

  const handleDeactivate = () => {
    dispatch(disconnectWallet());
    localStorage.removeItem("walletType");
    onClose();
  };

  return (
    <Modal onClose={onClose} sm>
      <div className={`row ${styles.row}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`col-12 ${styles.col}`}
            onClick={() => handleWalletConnect(item.type)}
          >
            <div className={styles.item}>
              <a href={item.href} className={styles.inner}>
                <div className={styles.thumb}>
                  <div className="object object--fill">
                    <img
                      className="object__fit object__fit--contain"
                      src={item.src}
                      alt={item.title}
                    />
                  </div>
                </div>
                {item.title}
              </a>
            </div>
          </div>
        ))}
        <div
          className={`col-12 d-grid ${styles.col}`}
          onClick={() => handleDeactivate()}
        >
          <a
            href="#"
            className="btn btn-info d-inline-flex align-items-center justify-content-center"
          >
            Deactivate
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
