import React from 'react';
import styles from '../../styles/modules/Assets/AssetListItemDetails.module.scss';

export default function AssetListItemDetails(props) {
  return (
    <section className={styles.el}>
      {/*<div className={styles.content}>*/}
      {/*  <h3 className={styles.title}>Details</h3>*/}
      {/*  <ul className={styles.list}>*/}
      {/*    {props.item.details.map((item, index) => (*/}
      {/*      <li key={index}>*/}
      {/*        {item.term} <span className="text-muted">{item.desc}</span>*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*</div>*/}
      <p className={styles.total}>
        TENFI Pending:
        <span className={styles.value}>
          <span className="text-danger">0.00000 </span>
          ($0.00)
        </span>
      </p>
      <div className="d-grid">
        <a href="#"
          className="btn btn-outline-white">Claim
        </a>
      </div>
     <div className={styles.text}>
       <p>How to buy and add to staking <a href="#">Tutorials</a></p>
       <p>Fees & Tokenomics <a href="#">Read Docs</a></p>
     </div>
    </section>
  );
}
