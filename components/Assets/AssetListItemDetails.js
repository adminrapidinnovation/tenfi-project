import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "styles/modules/Assets/AssetListItemDetails.module.scss";
import { harvestTenFiLpTokens, getTenPrice } from "contract/ContractMethods";
import { refreshPoolData } from "global-function/globalFunction";
import AssetFeeDetails from "./AssetFeeDetails";

const AssetListItemDetails = (props) => {
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  const [tenPrice, setTenPrice] = useState(0);
  const [claimLoading, setClaimLoading] = useState(false);
  const { item } = props;

  useEffect(() => {
    const getPrice = async () => {
      try {
        const price = await getTenPrice();
        setTenPrice(price);
      } catch {}
    };
    getPrice();
  }, []);

  const handleClaim = async () => {
    if (selector.user.isLoggedIn) {
      try {
        setClaimLoading(true);
        await harvestTenFiLpTokens(item.id, selector.user.address);
      } catch (error) {
        console.log("error==>", error);
      } finally {
        setClaimLoading(false);
        await refreshPoolData(selector.user.address, dispatch);
      }
    }
  };

  const getClaimDollarValue = () => {
    const val = parseFloat(tenPrice) * parseFloat(item.pendingTenEarnings);
    return parseFloat(val).toFixed(2);
  };
  return (
    <section className={styles.el}>
      {/* <div className={styles.content}>
        <h3 className={styles.title}>Details</h3>
        <ul className={styles.list}>
          {props.item.details.map((item, index) => (
            <li key={index}>
              {item.term} <span className="text-muted">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div> */}
      <p className={styles.total}>
        TENFI Pending:
        <span className={styles.value}>
          <span className="text-danger">
            {parseFloat(item.pendingTenEarnings).toFixed(2)}
          </span>{" "}
          (${getClaimDollarValue()})
        </span>
      </p>
      <div className="d-grid">
        <button
          className="btn btn-outline-white"
          onClick={() => handleClaim()}
          disabled={claimLoading}
        >
          {claimLoading ? "Loading..." : "Claim"}
        </button>
      </div>

      <AssetFeeDetails item={item} />
    </section>
  );
};

export default AssetListItemDetails;
