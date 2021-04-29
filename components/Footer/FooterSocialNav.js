import GithubIcon from '../../icons/GithubIcon';
import MediumIcon from '../../icons/MediumIcon';
import TwitterIcon from '../../icons/TwitterIcon';
import TelegramIcon from '../../icons/TelegramIcon';
import styles from '../../styles/modules/FooterSocialNav.module.scss';

export default function FooterSocialNav() {
  const items = [
    {
      icon: <TwitterIcon />,
      href: 'https://twitter.com/tenfinance',
      title: 'Twitter',
    },
    {
      icon: <TelegramIcon />,
      href: 'https://t.me/tenfinance',
      title: 'Telegram',
    },
    {
      icon: <MediumIcon />,
      href: 'https://medium.com/tenfinance',
      title: 'Medium',
    },
    {
      icon: <GithubIcon />,
      href: 'https://github.com/tenfinance',
      title: 'Github',
    },
  ];
  return (
    <nav className={styles.nav}>
      {items.map((item, index) => (
        <a key={index}
          href={item.href}
          className={styles.link}
          target="_blank">
          {item.icon}
          {item.title}
        </a>
      ))}
    </nav>
  );
}
