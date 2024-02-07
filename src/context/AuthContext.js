// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import http from 'src/configs/http-common'
import { logout, resetLogoutResponse } from 'src/store/apps/auth'

import { getLandingPage } from 'src/store/apps/category'
import { getCurrentUserProfile } from 'src/store/apps/profile'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  // ** Hook
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const { logoutResponseStatus, msg } = useSelector(state => state.auth)
  const { redirectionPage } = useSelector(state => state.category)
  const { userProfile } = useSelector(state => state.profile)
  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      // const storedToken = localStorage.getItem(authConfig.storageTokenKeyName)
      const userData = localStorage.getItem(authConfig.userData)
      const userLanguage = localStorage.getItem(authConfig.selectedLanguage)
      userLanguage ? i18n.changeLanguage(userLanguage) : i18n.changeLanguage('en')
      setUser(JSON.parse(userData))

      if (userData) {
        console.log('inside user Data')
        await http
          .post('/auth', {
            function: 'VALIDATE'
          })
          .then(async response => {
            console.log('inside then')
            const { data } = response
            if (data.status === 'SUCCESS') {
              console.log('inside success if')
              setUser(JSON.parse(userData))
            } else {
              handleLogout()
            }
            setLoading(false)
          })
          .catch(() => {
            console.log('ok catch')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }

      // if (storedToken) {
      //   // console.log('init auth inside if')
      //   setLoading(false)
      //   setUser(JSON.parse(userData))
      //   await http
      //     .post('/auth', {
      //       function: 'VALIDATE'
      //     })
      //     .then(async response => {
      //       //console.log('ok then')
      //       setLoading(false)
      //       // setUser({ ...response.data.userData })
      //     })
      //     .catch(() => {
      //       console.log('ok catch')
      //       setUser(null)
      //       setLoading(false)
      //       if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
      //         router.replace('/login')
      //       }
      //     })
      // } else {
      //   setLoading(false)
      // }
    }

    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (logoutResponseStatus && logoutResponseStatus === 'SUCCESS') {
      setUser(null)
      setLoading(false)
      dispatch(resetLogoutResponse())
      router.replace('/login')
    } else if (logoutResponseStatus) {
      console.log('ok catch')
      setUser(null)
      setLoading(false)
      dispatch(resetLogoutResponse())
      if (!router.pathname.includes('login')) {
        router.replace('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutResponseStatus])

  // useEffect(() => {
  //     if (redirectionPage === 'ONBOARDING') {
  //       router.push('/onboarding')
  //     } else if (redirectionPage === 'DASHBOARD') {
  //       router.push('/dashboard')
  //     } else if (redirectionPage === 'ACTIVATION') {
  //       router.push('/onboarding/documents')
  //     } else{
  //       router.push('/')
  //     }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [redirectionPage])

  const handleLogin = (params, errorCallback) => {
    http
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const { data } = response
        if (data.status === 'SUCCESS') {
          // localStorage.setItem(authConfig.storageTokenKeyName, data.auth.jwt)
          dispatch(
            getCurrentUserProfile({
              function: 'SEARCH',
              scope: 'BYID'
            })
          )
          dispatch(
            getLandingPage({
              function: 'GET_LANDING_PAGE'
            })
          ).then(({payload})=>{
            const landingPage = payload?.user.landing_page?.landing_page;
            if (landingPage === 'ONBOARDING') {
              router.push('/onboarding')
            } else if (landingPage === "DASHBOARD") {
              router.push('/dashboard')
            } else if (landingPage === 'ACTIVATION') {
              router.push('/onboarding/documents')
            } else{
              router.push('/')
            }
          })

          localStorage.setItem(
            authConfig.userData,
            JSON.stringify({
              ...data.auth.user,
              ...data.auth.user_entity_info,
              profile_image: userProfile?.profile_image ?? ""
            })
          )
          setUser({ ...data.auth.user, ...data.auth.user_entity_info, profile_image: userProfile?.profile_image ?? "" })
          // router.push('/' + 'onboarding')
        } else if (data.status === 'FAILURE') {
          toast.error('BAD CREDENTIALS !! TRY AGAIN !!')
        } else {
          toast.error('SOMETHING WENT WRONG !! TRY AGAIN LATER !!')
        }
      })
      .catch(err => {
        console.log('why error', err)
        toast.error('Something went wrong.... Try again later.', {
          duration: 8000
        })

        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem(authConfig.userData)
    // window.localStorage.removeItem(authConfig.storageTokenKeyName)
    dispatch(
      logout({
        function: 'LOG_OUT'
      })
    )
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
