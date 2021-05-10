import React, { useState, Fragment, cloneElement } from "react";
import { useSelector } from "react-redux";
import ChevronDownIcon from "icons/ChevronDownIcon";
import AssetsListDropdown from "./AssetListDropdown";
import styles from "styles/modules/Assets/AssetList.module.scss";
import TENFiIcon from "assets/images/TEnfi-token.svg";
import BUSDIcon from "assets/images/busd.svg";
import BNBIcon from "assets/images/binance-coin-bnb-logo.svg";
import ADAIcon from "assets/images/ada-icon.svg";
import BTCBIcon from "assets/images/btcb-icon.svg";
import CAKEIcon from "assets/images/cake-icon.svg";
import DAIIcon from "assets/images/dai-icon.svg";
import DOTIcon from "assets/images/Dot.svg";
import ETHIcon from "assets/images/eth-icon.svg";
import LINKIcon from "assets/images/link-icon.svg";
import UNIIcon from "assets/images/uni-icon.svg";
import USDCIcon from "assets/images/usdc-icon.svg";
import USDTIcon from "assets/images/usdt-icon.svg";
import VAIIcon from "assets/images/vai.png";
import XRPIcon from "assets/images/xrp-icon.svg";

import AssetIcons from "./AssetIcons";

const renderIcon = (rowId, token) => {
  const title = token.split("-");
  if (rowId === 0) {
    return (
      <AssetIcons
        firstImg={ADAIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 1) {
    return (
      <AssetIcons
        firstImg={BTCBIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 2) {
    return (
      <AssetIcons
        firstImg={BUSDIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 3) {
    return (
      <AssetIcons
        firstImg={CAKEIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 4) {
    return (
      <AssetIcons
        firstImg={DAIIcon}
        firstTitle={title[0]}
        secondImg={BUSDIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 5) {
    return (
      <AssetIcons
        firstImg={DOTIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 6) {
    return (
      <AssetIcons
        firstImg={ETHIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 7) {
    return (
      <AssetIcons
        firstImg={LINKIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 8) {
    return (
      <AssetIcons
        firstImg={UNIIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 9) {
    return (
      <AssetIcons
        firstImg={USDCIcon}
        firstTitle={title[0]}
        secondImg={BUSDIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 10) {
    return (
      <AssetIcons
        firstImg={USDTIcon}
        firstTitle={title[0]}
        secondImg={BUSDIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 11) {
    return (
      <AssetIcons
        firstImg={USDTIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 12) {
    return (
      <AssetIcons
        firstImg={VAIIcon}
        firstTitle={title[0]}
        secondImg={BUSDIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 13) {
    return (
      <AssetIcons
        firstImg={XRPIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
};

function AssetList(props) {
  const selector = useSelector((state) => state);
  const { poolData, poolDataLoading, filterValue } = selector.user;
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleActive = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const getPoolDataArray = () => {
    if (filterValue === "") {
      return poolData;
    } else {
      const filterData = poolData.filter((e) =>
        e.token.toLowerCase().includes(filterValue.toLowerCase())
      );
      return filterData;
    }
  };
  const renderRowItem = () => {
    const newPoolData = getPoolDataArray();
    return newPoolData.map((item, index) => {
      if (poolData[index] !== undefined) {
        return (
          <Fragment key={index}>
            <tr
              className={`${styles.headrow} ${
                index === activeIndex ? styles.active : ""
              }`}
            >
              {renderIcon(item.id, item.token)}
              <td className={styles.colEmpty}>&nbsp;</td>
              <td className={styles.colApi}>
                <span className={styles.badge}>
                  APY{" "}
                  {item.totalApy
                    ? parseFloat(item.totalApy).toFixed(2)
                    : "0.00"}
                </span>
              </td>
              <td className={styles.colText1}>
                TVL {parseFloat(item.tokenTvl).toFixed(2)}
              </td>
              <td className={styles.colText2}>TENFI Pending: {item.earned}</td>
              <td className={styles.colBtn}>
                <button
                  className={`btn btn-icon btn-secondary ${
                    index === activeIndex ? styles.btnActive : ""
                  }`}
                  type="button"
                  onClick={() => {
                    toggleActive(index);
                  }}
                >
                  <ChevronDownIcon />
                </button>
              </td>
            </tr>
            {index === activeIndex && (
              <tr>
                <td colSpan="8" style={{ padding: "0" }}>
                  {cloneElement(props.children, { item, index })}
                </td>
              </tr>
            )}
          </Fragment>
        );
      }
    });
  };

  return (
    <Fragment>
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan="3">
              <AssetsListDropdown title="Assets" />
            </th>
            <th>
              <AssetsListDropdown title="APY %" />
            </th>
            <th colSpan="3">
              <AssetsListDropdown title="Deposits ($)" />
            </th>
          </tr>
        </thead>
        <tbody>{!poolDataLoading && renderRowItem()}</tbody>
      </table>
      <div>
        {poolDataLoading && (
          <h1 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h1>
        )}
      </div>
    </Fragment>
  );
}

export default AssetList;
