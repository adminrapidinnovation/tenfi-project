import styles from '../../styles/modules/Assets/AssetsSection.module.scss';

export default function AssetsSection(props) {
  return (
    <section className={styles.el}>
      <header className={`row justify-content-between ${styles.row}`}>
        <div className={`col-12 col-md-6 ${styles.col}`}>
          <div className={styles.left}>
            <h2 className={styles.title}>
              Available Staking Assets
            </h2>
            <p className={styles.summ}>
              (Read a <a href="#">step-by-step guide</a> on how to get the LP token)
            </p>
          </div>
        </div>
        <div className={`col-12 col-md-6 ${styles.col}`}>
          <div className={styles.right}>
            {props.right}
          </div>
        </div>
      </header>
      {props.children}
    </section>
  );
}
