import Link from 'next/link';
import styles from '../../styles/modules/Footer.module.scss';
import Container from '../Container';
import FooterSocialNav from './FooterSocialNav';

export default function Footer() {
  const items = [
    {
      href: 'https://tenfinance.gitbook.io/faq/',
      title: 'About',
    },
    {
      href: 'https://tenfinance.gitbook.io/faq/documentation',
      title: 'Documentation',
    },
    {
      href: 'https://tenfinance.gitbook.io/faq/terms-of-use#terms-of-use',
      title: 'Terms of use',
    },
    {
      href: 'https://tenfinance.gitbook.io/faq/terms-of-use#privacy-policy',
      title: 'Privacy Policy',
    },
    {
      href: 'https://tenfinance.gitbook.io/faq/terms-of-use#cookie-policy',
      title: 'Cookie Policy',
    },
  ];
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <FooterSocialNav />
          <nav className={`d-flex flex-wrap justify-content-center ${styles.nav}`}>
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <a>
                      {item.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <small className={styles.copyright}>Copyright © {new Date().getFullYear()} TenFi</small>
        </div>
      </Container>
    </footer>
  );
}
