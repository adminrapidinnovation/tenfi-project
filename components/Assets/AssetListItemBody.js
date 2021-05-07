import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BuyTenfiModal from "../BuyTenfiModal";
import AddLiquidityModal from "../AddLiquidityModal";
import AssetDetails from "./AssetDetails";
import AssetApyDetails from "./AssetApyDetails";
import AssetListItemDetails from "./AssetListItemDetails";
import NumberField from "../NumberField";
import styles from "styles/modules/Assets/AssetListItemBody.module.scss";
import { handleOnDeposit, handleOnWithdraw } from "contract/ContractMethods";
import { refreshPoolData } from "global-function/globalFunction";
import AssetFeeDetails from "./AssetFeeDetails";

const AssetListItemBody = (props) => {
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [liquidityModalOpen, setLiquidityModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const { item } = props;

  const depositHandler = async () => {
    if (depositAmount > 0 && selector.user.isLoggedIn) {
      try {
        setDepositLoading(true);
        await handleOnDeposit(
          props.item.id,
          depositAmount,
          selector.user.address
        );
      } catch (err) {
        console.log(err);
      } finally {
        setDepositLoading(false);
        await refreshPoolData(selector.user.address, dispatch);
      }
    }
  };

  const withdrawHandler = async () => {
    if (withdrawAmount > 0 && selector.user.isLoggedIn) {
      try {
        setWithdrawLoading(true);
        await handleOnWithdraw(
          props.item.id,
          withdrawAmount,
          selector.user.address
        );
      } catch (err) {
        console.log(err);
      } finally {
        setWithdrawLoading(false);
        await refreshPoolData(selector.user.address, dispatch);
      }
    }
  };
  const maxDepositAmount = () => {
    setDepositAmount(parseFloat(item.liquidBalance));
  };
  const maxWithdrawAmount = () => {
    setWithdrawAmount(parseFloat(item.currentLpDeposit));
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
                    <span>{parseFloat(item.liquidBalance).toFixed(2)}</span>
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
                    setMax={maxDepositAmount}
                    value={depositAmount}
                  />
                  <div className="d-grid">
                    <button
                      type="button"
                      className={`btn btn-primary isLoading`}
                      onClick={depositHandler}
                      disabled={depositLoading}
                    >
                      {depositLoading ? "Loading..." : "Deposit"}
                    </button>
                  </div>
                </div>
              </div>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <div className={styles.item}>
                  <div className={styles.attr}>
                    <strong>Deposit</strong>
                    <span>
                      {parseFloat(item.currentLpDeposit).toFixed(2)}
                      {/* <span className="text-muted"> ($0.00)</span> */}
                    </span>
                  </div>
                  <NumberField
                    color="danger"
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    setMax={maxWithdrawAmount}
                    value={withdrawAmount}
                  />
                  <div className="d-grid">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={withdrawHandler}
                      disabled={withdrawLoading}
                    >
                      {withdrawLoading ? "Loading..." : "Withdraw"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={`row ${styles.row}`}>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <AssetDetails item={item} />
              </div>
              <div className={`col-12 col-md-6 ${styles.col}`}>
                <AssetApyDetails item={item} />
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
