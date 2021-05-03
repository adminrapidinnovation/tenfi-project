import React, { Fragment } from "react";
import styles from "styles/modules/Assets/AssetList.module.scss";
import AssetListItemLogoName from "./AssetListItemLogoName";
import SpinnersIcon from "icons/SpinnersIcon";

const AssetIcons = ({ firstImg, firstTitle, secondImg, secondTitle }) => {
  return (
    <Fragment>
      <td className={styles.colTitle1}>
        <AssetListItemLogoName title={firstTitle} src={firstImg} />
      </td>
      <td className={styles.colSpinners}>
        {secondTitle && (
          <span className={styles.spinners}>
            <SpinnersIcon />
          </span>
        )}
      </td>
      <td className={styles.colTitle2}>
        {secondTitle && (
          <AssetListItemLogoName title={secondTitle} src={secondImg} />
        )}
      </td>
    </Fragment>
  );
};

export default AssetIcons;
