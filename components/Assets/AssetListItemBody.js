import React, { useState } from "react";
import { useSelector } from "react-redux";
import BuyTenfiModal from "../BuyTenfiModal";
import AddLiquidityModal from "../AddLiquidityModal";
import AssetListItemAttributes from "./AssetListItemAttributes";
import AssetListItemDetails from "./AssetListItemDetails";
import NumberField from "../NumberField";
import styles from "styles/modules/Assets/AssetListItemBody.module.scss";
import { handleDeposit, handleWithdraw } from "block-chain/BlockChainMethods";

const AssetListItemBody = (props) => {
  const selector = useSelector((state) => state);
  const details = [
    {
      term: "Asset",
      desc: "TENFI",
    },
    {
      term: "TVL",
      desc: "$110,562,156.00",
    },
    {
      term: "Vault Contract",
      desc: `<a href="#">View</a>`,
    },
  ];
  const calcs = [
    {
      term: "Farm APY",
      desc: "67%",
      daily: "0.06%",
    },
    {
      term: "Rewards APR",
      desc: "3450%",
      daily: "54.56%",
    },
    {
      term: "Total",
      desc: "3517% (54.62% Daily)",
      daily: "54.62%",
    },
  ];
  const [modalOpen, setModalOpen] = useState(false);
  const [liquidityModalOpen, setLiquidityModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const depositHandler = async () => {
    if (depositAmount > 0 && selector.user.isLoggedIn) {
      try {
        handleDeposit(props.item.id, depositAmount, selector.user.address);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const withdrawHandler = () => {
    if (withdrawAmount > 0 && selector.user.isLoggedIn) {
      try {
        handleWithdraw(props.item.id, withdrawAmount, selector.user.address);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className={styles.el}>
        <div className="row gx-0">
          <div className={`col-12 col-lg-8 ${styles.left}`}>
            <div className={`row ${styles.row}`}>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <div className={styles.item}>
                  <div className={styles.attr}>
                    <strong>Balance</strong>
                    <span>
                      0.00000
                      <span className="text-muted"> ($0.00)</span>
                    </span>
                  </div>
                  <div className="text-end lh-1">
                    {props.index === 0 ? (
                      <button
                        type="button"
                        className={styles.link}
                        onClick={() => setModalOpen(!modalOpen)}
                      >
                        Get TENFI
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.link}
                        onClick={() =>
                          setLiquidityModalOpen(!liquidityModalOpen)
                        }
                      >
                        Get TENFI/BNB LP
                      </button>
                    )}
                  </div>
                  <NumberField
                    color="primary"
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <div className="d-grid">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={depositHandler}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
              </div>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <div className={styles.item}>
                  <div className={styles.attr}>
                    <strong>Deposit</strong>
                    <span>
                      0.00000
                      <span className="text-muted"> ($0.00)</span>
                    </span>
                  </div>
                  <NumberField
                    color="danger"
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <div className="d-grid">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={withdrawHandler}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={`row ${styles.row}`}>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <AssetListItemAttributes title="Details" items={details} />
              </div>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <AssetListItemAttributes
                  title="APY Calculations"
                  items={calcs}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <AssetListItemDetails {...props} />
          </div>
        </div>
      </div>
      {modalOpen && (
        <BuyTenfiModal title="Buy TENFI" onClose={() => setModalOpen(false)} />
      )}
      {liquidityModalOpen && (
        <AddLiquidityModal
          title="Add Liquidity"
          onClose={() => setLiquidityModalOpen(false)}
        />
      )}
    </>
  );
};

export default AssetListItemBody;
