import React from 'react';
import PlusIcon from '../icons/PlusIcon';
import AddLiquidityStats from './AddLiquidityStats';
import ExchangeItem from './ExchangeItem';
import ModalBlack from './ModalBlack';
import styles from '../styles/modules/AddLiquidityModal.module.scss';

export default function AddLiquidityModal({
  onClose,
  title,
}) {
  return (
    <ModalBlack onClose={onClose}
      title={title}>
      <ExchangeItem src={require('assets/images/pancakeswap-cake-logo.svg')}
        title="CAKE">
        Input
      </ExchangeItem>
      <span className={styles.svg}>
        <PlusIcon />
      </span>
      <ExchangeItem src={require('assets/images/binance-coin-bnb-logo.svg')}
        title="BNB">
        Input
      </ExchangeItem>
      <AddLiquidityStats />
      <div className={styles.footer}>
        <button className="btn btn-primary"
          type="button">
          Add Liquidity
        </button>
      </div>
    </ModalBlack>
  );
}
