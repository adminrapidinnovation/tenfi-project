import React, { useState } from 'react';
import Container from 'components/Container';
import ArrowDashedIcon from '../icons/ArrowDashedIcon';
import InfoIcon from '../icons/InfoIcon';
import styles from '../styles/modules/PromotionBanner.module.scss';
import NewsModal from './NewsModal';

export default function PromotionBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.el}>
      <Container>
        <div className="d-flex align-items-center justify-content-center">
          <span className={styles.infoSvg}>
            <InfoIcon />
          </span>
          <div>
            <strong className="text-primary">New!</strong> Get 60% bonus TENFI tokens, offer ends
            Mar.
            31 2021!
            <button
              className={styles.link}
              type="button"
              onClick={() => setModalOpen(!modalOpen)}>
              &nbsp;
              Learn More
              <ArrowDashedIcon />
            </button>
          </div>
        </div>
      </Container>
      {modalOpen && (
        <NewsModal title="News"
          onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
