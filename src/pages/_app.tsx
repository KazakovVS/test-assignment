import type { FC } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import nProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { RTL } from '../components/rtl';
import { SettingsButton } from '../components/settings-button';
import { SettingsConsumer, SettingsProvider } from '../contexts/settings-context';
import { store } from '../store';
import { createTheme } from '../theme';
import { createEmotionCache } from '../utils/create-emotion-cache';
import '../i18n';

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
}

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App: FC<EnhancedAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Material Kit Pro</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => (
                <ThemeProvider
                  theme={createTheme({
                    direction: settings.direction,
                    responsiveFontSizes: settings.responsiveFontSizes,
                    mode: settings.theme,
                  })}
                >
                  <RTL direction={settings.direction}>
                    <CssBaseline />
                    <Toaster position="top-center" />
                    <SettingsButton />
                    {getLayout(<Component {...pageProps} />)}
                  </RTL>
                </ThemeProvider>
              )}
            </SettingsConsumer>
          </SettingsProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
