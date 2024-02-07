import { useTranslation } from 'react-i18next'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// ** Custom Component Import
import Translations from 'src/layouts/components/Translations'
import GMETitle from 'src/views/register/GMETitle'
import GoBackButton from 'src/views/register/GoBackButton'

// ** Redux Actions
import { Box, Typography } from '@mui/material'
import Router from 'next/router'
import Image from 'next/image'
import { Icon } from '@iconify/react'

const StepRecoverPassword = ({ handlePrev, email }) => {
  const { t } = useTranslation()

  return (
    <>
      {/* <GoBackButton handlePrev={handlePrev} /> */}

      {/* <GMETitle title='Recover Password' subTitle='Enter your registered email to recover your password' /> */}

      <Grid container spacing={5} sx={{ mb: 16 }}>
        <Grid item xs={12}>
          <Typography variant='h4'>Password recovery link has been sent to {email}</Typography>

          <Typography>Follow the instructions in the email and reset your password.</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Icon icon='teenyicons:tick-circle-solid' color='#3be362' width='60' height='60' />
          </Box>
        </Grid>
      </Grid>

      <Button
        onClick={() => {
          Router.push('/login')
        }}
        fullWidth
        variant='contained'
        sx={{ mb: 4, mt: 4 }}
      >
        <Translations text='Back Home' />
      </Button>
    </>
  )
}

export default StepRecoverPassword
