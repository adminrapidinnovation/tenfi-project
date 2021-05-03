import { useSelector } from "react-redux";
import Link from "next/link";
import Container from "components/Container";
import React, { useState } from "react";
import LogoIcon from "icons/LogoIcon";
import styles from "styles/modules/Header.module.scss";
import ConnectWalletModal from "../ConnectWalletModal";
import HeaderNav from "./HeaderNav";

export default function Header() {
  const selector = useSelector((state) => state);
  const { isLoggedIn, address } = selector.user;
  const [modalOpen, setModalOpen] = useState(false);

  const getAddress = (address) => {
    const add1 = address.substring(0, 2);
    const add2 = address.substring(address.length - 6);
    const finalAdd = `${add1}..............${add2}`;
    return finalAdd;
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={`row flex-nowrap gx-0 ${styles.row}`}>
          <div className={`col-auto ${styles.col} ${styles.left}`}>
            <Link href="/">
              <a className={styles.logo}>
                <LogoIcon />
              </a>
            </Link>
          </div>
          <div className={`ms-auto col-auto ${styles.col} ${styles.right}`}>
            <div
              className={`row align-items-center flex-nowrap gx-0 ${styles.row}`}
            >
              <div className={`d-none d-md-block col-auto ${styles.col}`}>
                <HeaderNav />
              </div>
              <div className={`col-auto ${styles.col}`}>
                <button
                  className={`btn btn-primary ${styles.connectBtn}`}
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  {isLoggedIn ? getAddress(address) : "Connect wallet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {modalOpen && <ConnectWalletModal onClose={() => setModalOpen(false)} />}
    </header>
  );
}
