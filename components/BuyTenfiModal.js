import React from 'react';
import ArrowDashedDownIcon from '../icons/ArrowDashedDownIcon';
import ExchangeItem from './ExchangeItem';
import ModalBlack from './ModalBlack';
import styles from '../styles/modules/BuyTenfiModal.module.scss';

export default function BuyTenfiModal({
  onClose,
  title,
}) {
  return (
    <ModalBlack onClose={onClose}
      title={title}>
      <ExchangeItem src={require('assets/images/busd.svg')}
        title="BUSD">
        From
      </ExchangeItem>
      <span className={styles.svg} >
        <ArrowDashedDownIcon />
      </span>
      <ExchangeItem src={require('assets/images/TEnfi-token.svg')}
        title="TENFI">
        To
      </ExchangeItem>
      <div className={styles.footer}>
        <button className="btn btn-primary"
          type="button">
          Buy Tenfi
        </button>
      </div>
    </ModalBlack>
  );
}
