// ** MUI Imports

import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'

import { resetChangePasswordResponse } from 'src/store/apps/auth'

// ** Demo Components

import ChangePasswordCard from 'src/views/register/user-profile/security/ChangePasswordCard'

const TabSecurity = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const { changePasswordResponse, msg } = useSelector(state => state.auth)

  useEffect(() => {
    if (changePasswordResponse === 'SUCCESS') {
      toast.success(t('Password changed successfully'))
      dispatch(resetChangePasswordResponse())
    } else if (changePasswordResponse === 'FAILURE') {
      toast.error(t(msg))
      dispatch(resetChangePasswordResponse())

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePasswordResponse])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ChangePasswordCard />
      </Grid>
    </Grid>
  )
}

export default TabSecurity
