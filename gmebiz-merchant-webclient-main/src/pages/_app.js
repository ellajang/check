//Fube Note - No need to touch this file

// ** Next Imports
import Head from 'next/head'
import {Router, useRouter} from 'next/router'

// ** Store Imports
import { store } from 'src/store'
import {Provider, useDispatch} from 'react-redux'

// ** Loader Import
// Fube Note: top loading color bar ; might not be used
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/layouts/components/spinner'
//import Spinner from 'src/layouts/components/spinner-gme'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
//Fube Note - For code highlighting - might not be used in our project but just leave it here; used in card-snippet component
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

import 'animate.css'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** React circular progressbar Style - testing for gme
import 'react-circular-progressbar/dist/styles.css'

// ** Global css styles
//Fube Note: importing in this way is only possible in _app.js; it will not work in any other file
import '../../styles/globals.css'
import {useEffect} from "react";
import {useAuth} from "../hooks/useAuth";
import {createMuiTheme, createStyles} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {logout} from "../store/apps/auth";

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner sx={{ margin: '0 auto' }} />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner sx={{ margin: '0 auto' }} />}>{children}</AuthGuard>
  }
}



// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj
  const auth = useAuth();
  const router = useRouter();


  // logout the user if user closes their browser
  useEffect(() => {
    window.addEventListener("beforeunload", (ev) =>
    {
      ev.preventDefault();

      return ev.returnValue = 'Are you sure you want to close?';
    });

    return () => {
      window.removeEventListener('beforeunload', ()=>{
        auth.logout()
    })
    }
  }, []);



  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>GMEBiz</title>
          <meta name='description' content={`${themeConfig.templateName}`} />
          <meta name='keywords' content='GME B2B' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        {/* <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}> */}
                        {getLayout(<Component {...pageProps} />)}
                        {/* </AclGuard> */}
                      </Guard>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: 'react-hot-toast', duration: 4000 }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
