import { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
        <meta name="title" content="Wanderlust" />
        <meta name="image" content="/og-image.png" />
        <meta name="description" content="Find your next adventure" />

        <meta name="og:title" content="Wanderlust" />
        <meta name="og:description" content="Find your next adventure" />
        <meta name="og:image" content="/og-image.png" />
        <meta property="og:image:secure_url" content="/og-image.png" />
        <meta name="og:url" content="https://wanderlust.hultman.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wanderlust" />
        <meta property="og_locale" content="en_US" />

        <meta name="twitter:title" content="Wanderlust" />
        <meta name="twitter:description" content="Find your next adventure" />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:url" content="https://wanderlust.hultman.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@ACHultman" />

        <link rel="canonical" href="https://wanderlust.hultman.dev" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
