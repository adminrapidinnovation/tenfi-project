import React from 'react';
import Modal from './Modal';

export default function NewsModal({
  onClose,
  title,
}) {
  return (
    <Modal onClose={onClose}
      title={title}>
      <p>
        TEN is a fair launch project where everyone should have an equal opportunity to
        participate in the launch of the $TENFI token.
      </p>
      <p>
        We will conduct a direct distribution of 2% (5,120,000) of the maximum total supply
        (256,000,000) to be available for purchase at the rate of 1 BNB = 200 TENFI on April 5th
        at 14:00 GMT. Individuals who purchase $TENFI tokens between April 5th and April 12th
        14:00 GMT will be awarded a 60% purchase bonus.
      </p>
      <p>
        All $TENFI tokens purchased during the launch will be eligible for immediate staking
        along with the rest of the Staking pairs that are listed on <a href="https://ten.finance/"
        target="_blank">ten.finance</a>.
      </p>
      <p>
        $TENFI tokens can also be purchased and sold
        on <a href="https://pancakeswap.finance"
        target="_blank">pancakeswap.finance</a> during TEN platform launched.
      </p>
    </Modal>
  );
}
