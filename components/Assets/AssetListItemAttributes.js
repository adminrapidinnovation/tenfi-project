import React from 'react';
import styles from '../../styles/modules/Assets/AssetListItemAttributes.module.scss';

export default function AssetListItemAttributes({title, items}) {
  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item, index) => (
        <li key={index}>
          {item.term}: <span dangerouslySetInnerHTML={{__html: item.desc}} />
          { item.daily &&
           <span className="text-muted"> ({item.daily} Daily)</span>
          }
        </li>
        ))}
      </ul>
    </>
  );
}
