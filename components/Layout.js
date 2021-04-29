import Head from 'next/head';

export default function Layout({
  children,
  className,
  title = '',
}) {
  return (
    <div className={`min-vh-100 ${className}`}>
      <Head>
        <title>{title ? `${title} - TenFi` : 'TEN - Decentralized Finance, Simplified'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport"
          content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
      <div id="modal-root" />
    </div>
  );
}
