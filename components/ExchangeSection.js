import ExchangeItem from './ExchangeItem';
import styles from '../styles/modules/ExchangeSection.module.scss';

export default function ExchangeSection({ children }) {
  return (
    <div className={styles.el}>
      <ExchangeItem src={require('assets/images/binance-coin-bnb-logo.svg')}
        title="BUSD">
        From
      </ExchangeItem>
      {children}
      <ExchangeItem src={require('assets/images/TEnfi-token.svg')}
        title="TENFI">
        To
      </ExchangeItem>
    </div>
  );
}
