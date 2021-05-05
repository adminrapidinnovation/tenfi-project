import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "styles/modules/Assets/AssetListItemDetails.module.scss";
import { harvestLpTokens, getTenPrice } from "block-chain/BlockChainMethods";

const AssetListItemDetails = (props) => {
  const selector = useSelector((state) => state);
  const [tenPrice, setTenPrice] = useState(0);
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
        await harvestLpTokens(item.id, selector.user.address);
      } catch (error) {
        console.log("error==>", error);
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
        <button className="btn btn-outline-white" onClick={() => handleClaim()}>
          Claim
        </button>
      </div>
      <div className={styles.text}>
        <p>
          How to buy and add to staking <a href="#">Tutorials</a>
        </p>
        <p>
          Fees & Tokenomics <a href="#">Read Docs</a>
        </p>
      </div>
    </section>
  );
};

export default AssetListItemDetails;
