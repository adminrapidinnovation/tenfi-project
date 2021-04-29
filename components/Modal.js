import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import CloseIcon from '../icons/CloseIcon';
import styles from '../styles/modules/Modal.module.scss';

export default function Modal({
  onClose,
  title,
  children,
  sm,
}) {
  function onKeyUpEsc(event) {
    if (event.keyCode === 27) {
      onClose();
    }
  }

  function beforeEnter() {
    const { documentElement } = document;

    documentElement.style.overflowY = 'hidden';

    document.addEventListener('keyup', onKeyUpEsc, false);
  }

  function afterLeave() {
    const { documentElement } = document;

    documentElement.style.overflowY = null;

    document.removeEventListener('keyup', onKeyUpEsc, false);
  }

  useEffect(() => afterLeave, []);

  return ReactDOM.createPortal(
    <>
      <CSSTransition
        timeout={200}
        classNames="display"
        in
        appear
        unmountOnExit
      >
        <div className={styles.backdrop}
          onClick={onClose} />
      </CSSTransition>
      <CSSTransition
        timeout={200}
        classNames="display"
        in
        appear
        unmountOnExit
        onEnter={beforeEnter}
      >
        <div className={`${styles.el} ${sm ? styles.sm : ''}`}>
          <button className={styles.close}
            type="button"
            onClick={onClose}>
            <CloseIcon />
          </button>
          <div className={styles.inner}>
            {title && (
              <h2 className={styles.title}>{title}</h2>
            )}
            {children}
          </div>
        </div>
      </CSSTransition>
    </>,
    document.getElementById('modal-root'),
  );
}

Modal.propTypes = {
  sm: PropTypes.bool,
};
