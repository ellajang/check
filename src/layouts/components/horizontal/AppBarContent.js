// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
//import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

import UserDropdown from 'src/layouts/components/shared/UserDropdown'
//import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import LanguageDropdown from 'src/layouts/components/shared/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAllNotifications} from "../../../store/apps/notification";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {getMerchantKYC} from "../../../store/apps/profile";



const AppBarContent = props => {
  // ** Props
  const { settings, saveSettings } = props
  const {notifications} = useSelector(state=> state.notification);
  const dispatch = useDispatch();``
  const {t} = useTranslation()
  const {merchantProfile} = useSelector(state=>state.profile)


  useEffect(()=>{
    dispatch(getAllNotifications());
    dispatch(getMerchantKYC({
      by: "MERCHANT_ID",
      value: auth?.user?.source_id
    }))
  },[dispatch])

  const auth = useAuth()



  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      {!auth.user && <LanguageDropdown settings={settings} saveSettings={saveSettings}/>}
      {auth.user && (
        <>
          <Typography variant={'h6'} sx={{mr: 10}}>
            {t('Welcome ')}
            {
              merchantProfile?.business_name_native === "" && ' ' + t('Merchant')
            }
            {
              merchantProfile?.business_name_native ?? ' ' + t('Merchant')
            }
          </Typography>
          <LanguageDropdown settings={settings} saveSettings={saveSettings} />
          <NotificationDropdown settings={settings} notifications={notifications} />
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent
