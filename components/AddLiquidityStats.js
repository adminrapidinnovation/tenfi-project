import styles from '../styles/modules/AddLiquidityStats.module.scss';

export default function AddLiquidityStats() {
  return (
    <>
      <h4 className={styles.title}>Prices and Pool Share</h4>
      <div className={styles.el}>
        <div className="row gx-30 gy-20 justify-content-center">
          <div className={`col-auto ${styles.item}`}>
            22.648
            <span className={styles.term}>CAKE per BNB</span>
          </div>
          <div className={`col-auto ${styles.item}`}>
            0.0441018
            <span className={styles.term}>BNB per CAKE</span>
          </div>
          <div className={`col-auto ${styles.item}`}>
            0%
            <span className={styles.term}>Share of Pool</span>
          </div>
        </div>
      </div>
    </>
  );
}
