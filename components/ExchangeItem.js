import CurrencyInput from 'react-currency-input-field';
import styles from '../styles/modules/ExchangeItem.module.scss';
import AssetListItemLogoName from './Assets/AssetListItemLogoName';

export default function ExchangeItem(props) {
  return (
    <div className={styles.item}>
      <div className={`d-flex align-items-center justify-content-between ${styles.row}`}>
        <div>
          {props.children}
        </div>
        <div>Balance: 0.00000</div>
      </div>
      <div className={`d-flex align-items-center justify-content-between ${styles.row}`}>
        <CurrencyInput className={styles.input}
          defaultValue={0}
          step={0.00001}
          fixedDecimalLength={5}
          decimalSeparator="."
        />
        <div>
          <AssetListItemLogoName src={props.src}
            title={props.title} sm />
        </div>
      </div>
    </div>
  );
}
