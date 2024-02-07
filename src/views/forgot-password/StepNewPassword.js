// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

// ** MUI Components

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import FormControl from '@mui/material/FormControl'

import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'

import GMETitle from 'src/views/register/GMETitle'
import GoBackButton from 'src/views/register/GoBackButton'

const StepNewPassword = ({ handleNext, handlePrev }) => {
  const { t } = useTranslation()

  return (
    <>
      <GoBackButton handlePrev={handlePrev} />

      <GMETitle title='New Password' subTitle='Create a new password' />

      <Grid container spacing={5} sx={{ mb: 16 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <CustomTextField fullWidth type='password' placeholder={t('New password')} />
          </FormControl>
        </Grid>
      </Grid>

      <Button onClick={handleNext} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
        <Translations text='Continue' />
      </Button>
    </>
  )
}

export default StepNewPassword
