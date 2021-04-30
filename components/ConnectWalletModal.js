import React from "react";
import styles from "../styles/modules/ConnectWalletModal.module.scss";
import Modal from "./Modal";
import { BscConnector } from "@binance-chain/bsc-connector";
import Web3 from "web3";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { connect } from "react-redux";

function ConnectWalletModal({ onClose, setUserData }) {
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

  const handleWalletConnect = async (type) => {
    switch (type) {
      // ////////////////////////////////////////////////////////
      case "metamask":
        if (!window.ethereum) {
          window.alert("Please install MetaMask first.");
          return;
        }
        try {
          await window.ethereum.enable();
          web3 = new Web3(window.ethereum);
          const coinbase = await web3?.eth.getCoinbase();
          const publicAddress = coinbase.toLowerCase();
          console.log(publicAddress);
          setUserData(publicAddress, true);
        } catch (error) {
          window.alert("You need to allow MetaMask.");
          return;
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
          console.log(accounts);
        } catch (error) {
          console.log("bsc error-->", error);
        } finally {
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
        <div className={`col-12 d-grid ${styles.col}`}>
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
}

const mapStatesToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserData: (userData) => dispatch(isLoggedIn(userData)),
  };
};

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(ConnectWalletModal);
