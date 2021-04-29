import ChevronDownIcon from '../../icons/ChevronDownIcon';
import SpinnersIcon from '../../icons/SpinnersIcon';
import AssetListItemLogoName from './AssetListItemLogoName';
import styles from '../../styles/modules/Assets/AssetListItem.module.scss';

export default function AssetListItem({
  children,
  item,
}) {
  return (
    <div className={styles.el}>
      <div className={`d-flex ${styles.header}`}>
        <div className={styles.col1}>
          <AssetListItemLogoName title={item.title}
            src={item.src} />
          <span className={styles.spinners}>
            <SpinnersIcon />
          </span>
          <AssetListItemLogoName title="BNB"
            src={require('assets/images/binance-coin-bnb-logo.svg')} />
        </div>
        <div className={styles.col2}>
          <span className={styles.badge}>APY {item.apy}</span>
        </div>
        <div className={styles.col3}>
          <div className="row">
            <span className="col-6">TVL: {item.tvl}</span>
            <span className="col-6">TENFI Earned: {item.earned}</span>
          </div>
        </div>
        <div className={styles.col4}>
          <button className="btn btn-icon btn-secondary"
            type="button">
            <ChevronDownIcon />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
