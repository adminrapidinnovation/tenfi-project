import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png" />
          <link rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png" />
          <link rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png" />
          <link rel="manifest"
            href="/site.webmanifest" />
          <link rel="mask-icon"
            href="/safari-pinned-tab.svg"
            color="#eb4f45" />
          <meta name="msapplication-TileColor"
            content="#181e29" />
          <meta name="msapplication-TileImage"
            content="/mstile-144x144.png" />
          <meta name="theme-color"
            content="#181e29" />
          <link rel="preconnect"
            href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap"
            rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"
            rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
