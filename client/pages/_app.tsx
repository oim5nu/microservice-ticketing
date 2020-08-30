import React from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import buildClient from '../api/build-client';
import Header from '../components/header';
import theme from '../theme';

function AppComponent(props: any) {
  const { Component, pageProps, currentUser } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}

// context === { Component, ctx: { req, res } }
AppComponent.getInitialProps = async (appContext: AppContext) => {
  console.log('AppComponent');
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
