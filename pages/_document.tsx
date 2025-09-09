import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="description" content="SnapEvent - Connect with Professional Photographers" />
        <meta name="theme-color" content="#030213" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
