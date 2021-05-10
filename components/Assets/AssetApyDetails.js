import React, { Fragment } from "react";
import styles from "styles/modules/Assets/AssetListItemAttributes.module.scss";

const AssetApyDetails = ({ item }) => {
  return (
    <Fragment>
      <h3 className={styles.title}>APY Calculations</h3>
      <ul className={styles.list}>
        <li>
          Farm APY: <span>{parseFloat(item.farmApy).toFixed(2)}%</span>
        </li>
        <li>
          Rewards APR: <span>{parseFloat(item.tenApr).toFixed(2)}%</span>
        </li>
        <li>
          Total: <span>{parseFloat(item.totalApy).toFixed(2)}%</span>
        </li>
      </ul>
    </Fragment>
  );
};

export default AssetApyDetails;
