import React from "react";
import { useDispatch } from "react-redux";
import { connectWallet, disconnectWallet } from "redux/actions/user.actions";
import styles from "../styles/modules/ConnectWalletModal.module.scss";
import Modal from "./Modal";
import { BscConnector } from "@binance-chain/bsc-connector";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { connectToMetamask } from "block-chain/BlockChainMethods";

const items = [
  {
    type: "metamask",
    src: require("assets/images/Metamask-1.svg"),
    href: "#",
    title: "MetaMask",
  },
  {
    type: "bsc",
    src: require("assets/images/BinanceChainWallet.png"),
    title: "Binance Chain Wallet",
  },

  {
    type: "walletConnect",
    src: require("assets/images/walletconnect-circle-blue.svg"),
    href: "#",
    title: "Wallet Connect",
  },
];

const ConnectWalletModal = ({ onClose, setUserData }) => {
  const dispatch = useDispatch();
  const handleWalletConnect = async (type) => {
    switch (type) {
      // ////////////////////////////////////////////////////////
      case "metamask":
        try {
          const accounts = await connectToMetamask();
          if (!!accounts && accounts.length > 0) {
            dispatch(connectWallet(accounts[0]));
          } else {
            dispatch(disconnectWallet());
          }
        } catch (error) {
          dispatch(disconnectWallet());
        } finally {
          onClose();
        }
        break;
      // ///////////////////////////////////////////////////////////////////////
      case "bsc":
        console.log("bsc");
        const bsc = new BscConnector({
          supportedChainIds: [56, 97],
        });
        try {
          await bsc.activate();
          const accounts = await bsc.getAccount();
          if (accounts) {
            dispatch(connectEthWallet(accounts));
          } else {
            dispatch(disconnectWallet());
          }
        } catch (error) {
          dispatch(disconnectWallet());
        } finally {
          onClose();
        }
        break;
      // ////////////////////////////////////////////////////////////
      case "walletConnect":
        console.log("wallet connect");

        try {
          const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
          });
          if (!connector.connected) {
            // create new session
            connector.createSession();
          }
          connector.on("connect", (error, payload) => {
            if (error) {
              throw error;
            }

            // Get provided accounts and chainId
            const { accounts, chainId } = payload.params[0];
            console.log("Paylaod", payload);
            console.log("Account", accounts);
          });

          connector.on("session_update", (error, payload) => {
            if (error) {
              throw error;
            }
            const { accounts, chainId } = payload.params[0];
            console.log("Paylaod", payload);
            console.log("Account", accounts);
          });

          connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error;
            }
            console.log("Paylaod", payload);
            // Delete connector
          });
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        return;
    }
  };

  const handleDeactivate = () => {
    dispatch(disconnectWallet());
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
