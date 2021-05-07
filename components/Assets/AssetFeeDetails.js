import React, { Fragment } from "react";
import styles from "styles/modules/Assets/AssetListItemAttributes.module.scss";

const AssetFeeDetails = ({ item }) => {
  return (
    <div className={styles.feeText}>
      <h3 className={styles.title}>Fees</h3>
      <ul className={styles.list}>
        <li>
          Gas Fee: <span>0.01%</span>
        </li>
        <li>
          Network Fee: <span>0.4%</span>
        </li>
        <li>
          Burn Fee: <span>1.00%</span>
        </li>
        <li>
          Deposit Fee: <span>{`<0.08% on initial Staked (One Time Fee)`}</span>
        </li>
        <li>
          Withdraw Fee: <span>0.00%</span>
        </li>
      </ul>
    </div>
  );
};

export default AssetFeeDetails;
