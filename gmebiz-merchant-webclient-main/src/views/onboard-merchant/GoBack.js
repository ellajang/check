import React from 'react'
import Router from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'

function GoBack({ handleSplashState, handleBack, handleSkip }) {
  const { loading } = useSelector(state => state.category)

  const sendHome = () => {
    handleSplashState()
    // Router.push('/onboarding')
  }

  return (
    <Grid container>
      <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(1)} !important`, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {handleSplashState ? (
            <Button
              // disabled={activeStep === 1 && activeSubStep === 0}
              onClick={sendHome}
              disabled={loading}
              sx={{
                '& svg': { mr: 2 },
                ':hover': {
                  bgcolor: 'secondary.luma',
                  color: 'primary'
                },
                p: 0
              }}
            >
              <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
              <Translations text='Back' />
            </Button>
          ) : (
            <Button
              // disabled={activeStep === 1 && activeSubStep === 0}
              onClick={handleBack}
              disabled={loading}
              sx={{
                '& svg': { mr: 2 },
                ':hover': {
                  bgcolor: 'secondary.luma',
                  color: 'primary'
                },
                p: 0
              }}
            >
              <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
              <Translations text='Back' />
            </Button>
          )}
          {handleSkip && (
            <Button
              onClick={handleSkip}
              disabled={loading}
              sx={{
                '& svg': { ml: 2 },
                color: 'text.grey',
                fontWeight: '600',
                ':hover': {
                  bgcolor: 'secondary.luma',
                  color: 'primary'
                }
              }}
            >
              <>
                <Translations text='Skip' />
                <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
              </>
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default GoBack
