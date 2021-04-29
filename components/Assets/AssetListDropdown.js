import PropTypes from 'prop-types';
import CadetIcon from '../../icons/CadetIcon';
import styles from '../../styles/modules/Assets/AssetListDropdown.module.scss';
import HomeSummaryCard from '../HomeSummaryCard';

export default function AssetsListDropdown({title}) {
  return (
    <div className={`bg-primary ${styles.el}`}>
      {title}
      <CadetIcon />
    </div>
  );
}

HomeSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
};

