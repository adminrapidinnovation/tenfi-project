import React, { Fragment } from "react";
import styles from "styles/modules/Assets/AssetListItemAttributes.module.scss";

const AssetDetails = ({ item }) => {
  return (
    <Fragment>
      <h3 className={styles.title}>Details</h3>
      <ul className={styles.list}>
        <li>
          Asset: <span>{item.token}</span>
        </li>
        <li>
          TVL: <span>{parseFloat(item.tokenTvl).toFixed(2)}</span>
        </li>
        <li>
          Vault Contract:{" "}
          <a href={item.vaultContractt} target="_blank" rel="noreferrer">
            <span>View</span>
          </a>
        </li>
      </ul>
    </Fragment>
  );
};

export default AssetDetails;
