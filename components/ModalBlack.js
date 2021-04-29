import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import CloseIcon from '../icons/CloseIcon';
import styles from '../styles/modules/ModalBlack.module.scss';

export default function ModalBlack(props) {
  function onKeyUpEsc(event) {
    if (event.keyCode === 27) {
      props.onClose();
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
          onClick={props.onClose} />
      </CSSTransition>
      <CSSTransition
        timeout={200}
        classNames="display"
        in
        appear
        unmountOnExit
        onEnter={beforeEnter}
      >
        <div className={`${styles.el} ${props.sm ? styles.sm : ''}`}>
          <div className={styles.inner}>
            <header className={styles.header}>
              {props.title && (
                <h2 className={styles.title}>{props.title}</h2>
              )}
              <button className={styles.close}
                type="button"
                onClick={props.onClose}>
                <CloseIcon />
              </button>
            </header>
            {props.children}
          </div>
        </div>
      </CSSTransition>
    </>,
    document.getElementById('modal-root'),
  );
}

ModalBlack.propTypes = {
  sm: PropTypes.bool,
};
