import PropTypes from 'prop-types';
import styles from '../styles/modules/HomeSummary.module.scss';

export default function HomeSummaryCard({
  items,
  title,
  danger,
}) {
  return (
    <article className={styles.el}>
      <div className={`bg-body border border-2 ${styles.inner} ${danger
        ? 'border-danger'
        : 'border-primary'}`}>
        <header className={styles.header}>
          <h2 className={`d-inline-block ${styles.title} ${danger
            ? 'bg-danger'
            : 'bg-primary'}`}>{title}:
          </h2>
        </header>
        {items.length > 0 &&
        <ul className="row flex-md-nowrap">
          {items.map((item, index) => (
            <li key={index}
              className={`col-12 col-xs-6 col-md-auto ${styles.item}`}>
              {item.term}: {item.value}
            </li>
          ))}
        </ul>
        }
      </div>
    </article>
  );
}

HomeSummaryCard.defaultProps = {
  items: [],
};

HomeSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
};
