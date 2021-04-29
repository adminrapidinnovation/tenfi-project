import styles from '../../styles/modules/HeaderNav.module.scss';

export default function HeaderNav() {
  const items = [
    {
      href: 'https://tenfinance.gitbook.io/faq/',
      title: 'About',
    },
    {
      href: 'https://tenfinance.gitbook.io/faq/',
      title: 'Faq',
    },
  ];
  return (
    <nav className={styles.nav}>
      <ul className="row gx-0 flex-nowrap">
        {items.map((item, index) => (
          <li key={index}
            className="col-auto">
            <a className="d-block"
              href={item.href}
              target="_blank">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
