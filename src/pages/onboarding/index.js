import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import { getGeoInfo } from 'src/store/apps/category'

// ** Demo Components Imports
import StepperCustomVertical from 'src/views/onboard-merchant/StepperCustomVertical'

//import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'
import Translations from 'src/layouts/components/Translations'

const OnboardingWrapper = styled(Box)(({ theme }) => ({
  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  }
}))

const MerchantOnboarding = () => {
  const [splash, setSplash] = useState(true)

  const dispatch = useDispatch()

  const handleState = prevSplash => {
    setSplash(!prevSplash)
  }

  const FlagImage = styled('img')(({ theme }) => ({
    zIndex: 2,
    maxHeight: 320,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }))

  useEffect(() => {
    dispatch(getGeoInfo())
  }, [dispatch])

  if (splash) {
    return (
      <OnboardingWrapper>
        <Box className='content-center'>
          <Box
            sx={{
              width: 432,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <Box sx={{ width: '100%', padding: '1.5rem' }}>
              <Box sx={{ my: 6 }}>
                <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
                  <Translations text='Welcome to GMEBiz' />!
                </Typography>
                <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '18px', fontWeight: 400 }}>
                  <Translations text='To unlock the borderless payments, just complete a few quick tasks.' />
                </Typography>
              </Box>
              <Box sx={{ width: '100%', maxWidth: 300, position: 'relative', py: 20 }}>
                <FlagImage alt='GME Flag' src={'/images/pages/flag.png'} />
              </Box>
              <Button fullWidth onClick={handleState} variant='contained' sx={{ mb: 4 }}>
                <Translations text={`Let's get Started!`} />
              </Button>
            </Box>
          </Box>
        </Box>
      </OnboardingWrapper>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StepperCustomVertical handleState={handleState} />
      </Grid>
    </Grid>
  )
}

//MerchantOnboarding.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>
// MerchantOnboarding.guestGuard = true

export default MerchantOnboarding
