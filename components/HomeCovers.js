import styles from '../styles/modules/HomeCovers.module.scss';

export default function HomeCovers() {
  return (
    <>
      <div className={styles.cover}>
        <div className="object"
          style={{ paddingBottom: '67.6%' }}>>
          <img className="object__fit object__fit--cover"
            src={require('assets/images/Bitmap.jpg')}
            alt="Bitmap"
            style={{ objectPosition: '50% 64%' }}
          />
        </div>
      </div>
      <div className={styles.coverBottom}>
        <div className={styles.coverBottomInner}>
          <div className="object"
            style={{ paddingBottom: '67.6%' }}>
            <img className="object__fit object__fit--cover"
              src={require('assets/images/Bitmap.jpg')}
              alt="Bitmap"
              style={{ objectPosition: '50% 64%' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
