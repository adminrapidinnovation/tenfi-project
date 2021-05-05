import React, { useState, Fragment, cloneElement } from "react";
import { useSelector } from "react-redux";
import ChevronDownIcon from "icons/ChevronDownIcon";
import AssetsListDropdown from "./AssetListDropdown";
import styles from "styles/modules/Assets/AssetList.module.scss";
import TENFiIcon from "assets/images/TEnfi-token.svg";
import BNBIcon from "assets/images/binance-coin-bnb-logo.svg";
import BUSDIcon from "assets/images/busd.svg";
import USDCIcon from "assets/images/usdc.8dd9681c.svg";
import AssetIcons from "./AssetIcons";

const renderIcon = (rowId, token) => {
  const title = token.split("-");
  if (rowId === 0) {
    return <AssetIcons firstImg={TENFiIcon} firstTitle={title[0]} />;
  }
  if (rowId === 1) {
    return (
      <AssetIcons
        firstImg={TENFiIcon}
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
        secondImg={USDCIcon}
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
