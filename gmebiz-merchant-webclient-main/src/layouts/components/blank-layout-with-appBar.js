// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
// ** MUI Imports
import Chip from '@mui/material/Chip'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'
import LanguageDropdown from 'src/layouts/components/shared/LanguageDropdown'

import UserDropdown from 'src/layouts/components/shared/UserDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import NotificationDropdown from "../../@core/layouts/components/shared-components/NotificationDropdown";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getAllNotifications} from "../../store/apps/notification";
import {getLandingPage} from "../../store/apps/category";
import {Translation, useTranslation} from "react-i18next";
import {getMerchantKYC} from "../../store/apps/profile";

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const LinkStyled2 = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const BlankLayoutAppBar = () => {
  // ** Hooks & Vars
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const { skin } = settings
  const {notifications} = useSelector(state=> state.notification);
  const [redirectionLink, setRedirectionLink] = useState(`/`);
  const {t} = useTranslation()

  const auth = useAuth()

  const dispatch = useDispatch();

  const {merchantProfile} = useSelector(state=>state.profile)


  useEffect(()=>{
    dispatch(getAllNotifications());

    dispatch(getMerchantKYC({
      by: "MERCHANT_ID",
      value: auth?.user?.source_id
    }))

  },[dispatch])


  return (
    <AppBar
      color='default'
      position='sticky'
      elevation={skin === 'bordered' ? 0 : 1}
      sx={{
        backgroundColor: 'background.paper',
        ...(skin === 'bordered' && { borderBottom: `1px solid ${theme.palette.divider}` })
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: theme => `${theme.spacing(0, 6)} !important`,
          minHeight: `${theme.mixins.toolbar.minHeight - (skin === 'bordered' ? 1 : 0)}px !important`
        }}
      >
        <LinkStyled href={ auth.user ? '/dashboard' : '/'}>
          <Box sx={{ mr: 4, display: 'flex', justifyContent: 'center' }}>
            <img src={'/images/logo/logo.png'} alt='global payment accounts' height='30' width='150' />
          </Box>
        </LinkStyled>
        {!auth.user && (
          <>
            <LanguageDropdown settings={settings} saveSettings={saveSettings} />
          </>
        )}

        {auth.user && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <Typography variant={'h6'} sx={{mr: 10}}>
              {
                `${t('Welcome')} ${(merchantProfile?.business_name_native === "" ||
                  merchantProfile?.business_name_native === undefined ||
                  merchantProfile?.business_name_native === null) ?
                  t('Merchant') :
                  merchantProfile?.business_name_native
                }`
              }
            </Typography>
            <LanguageDropdown settings={settings} saveSettings={saveSettings} />
            <NotificationDropdown settings={settings} notifications={notifications} />
            <UserDropdown settings={settings} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default BlankLayoutAppBar
