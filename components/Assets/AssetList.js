import React, { useState } from "react";
import ChevronDownIcon from "../../icons/ChevronDownIcon";
import SpinnersIcon from "../../icons/SpinnersIcon";
import AssetsListDropdown from "./AssetListDropdown";
import AssetListItemLogoName from "./AssetListItemLogoName";
import styles from "../../styles/modules/Assets/AssetList.module.scss";
import { connect } from "react-redux";
import DownIcon from "assets/icons/down.svg";
import BUSDIcon from "assets/icons/busd.svg";
import USDTIcon from "assets/icons/USDT.png";
import FourBeltIcon from "assets/icons/4belt-icon.png";
import AQUAIcon from "assets/icons/blue-icon.svg";
import BNBIcon from "assets/icons/binance-chai.svg";

const renderIcon = (rowId, token) => {
  const title = token.split("-");
  if (rowId === 0) {
    return (
      <ImageGroup
        firstImg={BUSDIcon}
        firstTitle={title[0]}
        secondImg={USDTIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 1) {
    return <ImageGroup firstImg={FourBeltIcon} firstTitle={title[0]} />;
  }
  if (rowId === 2) {
    return (
      <ImageGroup
        firstImg={AQUAIcon}
        firstTitle={title[0]}
        secondImg={BNBIcon}
        secondTitle={title[1]}
      />
    );
  }
  if (rowId === 3) {
    return <ImageGroup firstImg={AQUAIcon} firstTitle={title[0]} />;
  }
};

const ImageGroup = ({ firstImg, firstTitle, secondImg, secondTitle }) => {
  return (
    <>
      <td className={styles.colTitle1}>
        <AssetListItemLogoName title={firstTitle} src={firstImg} />
      </td>
      <td className={styles.colSpinners}>
        {secondImg && (
          <span className={styles.spinners}>
            <SpinnersIcon />
          </span>
        )}
      </td>
      <td className={styles.colTitle2}>
        {secondImg && (
          <AssetListItemLogoName title={secondTitle} src={secondImg} />
        )}
      </td>
    </>
  );
};

function AssetList(props) {
  const { items } = props;
  const [activeIndex, setActiveIndex] = useState(-1);

  function toggleActive(index) {
    setActiveIndex(index === activeIndex ? -1 : index);
  }

  return (
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
      <tbody>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <tr
              className={`${styles.headrow} ${
                index === activeIndex ? styles.active : ""
              }`}
            >
              {/* <td className={styles.colTitle1}>
                <AssetListItemLogoName
                  title={item.title}
                  // src={renderIcon(item.id)[0]}
                  src={item.src}
                />
              </td>
              <td className={styles.colSpinners}>
                {item.title2 && (
                  <span className={styles.spinners}>
                    <SpinnersIcon />
                  </span>
                )}
              </td>
              <td className={styles.colTitle2}>
                {item.title2 && (
                  <AssetListItemLogoName
                    title={item.title2}
                    src={require("assets/images/binance-coin-bnb-logo.svg")}
                  />
                )}
              </td> */}
              {renderIcon(item.id, item.token)}
              <td className={styles.colEmpty}>&nbsp;</td>
              <td className={styles.colApi}>
                <span className={styles.badge}>APY {item.totalApy}</span>
              </td>
              <td className={styles.colText1}>TVL {item.tokenTvl}</td>
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
                  {React.cloneElement(props.children, { item, index })}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

const mapStatesToProps = (state) => {
  return {
    items: state.assets.filteredAssets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFilterAssets: () => dispatch(filterAssets()),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(AssetList);
