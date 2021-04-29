import React from 'react';
import styles from '../styles/modules/Container.module.scss';

export default function Container({
  type,
  children,
}) {
  return React.createElement(
    type,
    { className: styles.container },
    children,
  );
};

Container.defaultProps = {
  type: 'div',
};
