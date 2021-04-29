import PropTypes from 'prop-types';
import styles from '../../styles/modules/Assets/AssetListItemLogoName.module.scss';

export default function AssetListItemLogoName({ title, src, sm }) {
  return (
    <div className={`d-flex ${styles.el}`}>
      <div className={`${styles.thumb} ${sm ? styles.thumbSm : ''}`}>
        <div className='object object--fill'>
          <img className="object__fit object__fit--contain"
            src={src}
            alt={title}
          />
        </div>
      </div>
      {title}
    </div>
  );
}

AssetListItemLogoName.propTypes = {
  title: PropTypes.string.isRequired,
};

AssetListItemLogoName.propTypes = {
  src: PropTypes.string.isRequired,
};
