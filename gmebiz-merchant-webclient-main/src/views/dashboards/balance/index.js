// ** React Imports
import { useState } from 'react'
import { Grid, Box, Button } from '@mui/material'

// ** Step Components
import VirtualAccountTotalBalance from './VirtualAccountTotalBalance'
import CrmLastTransaction from '../merchant/CrmLastTransaction'
import VirtualAccountDetails from './VirtualAccountDetails'
import { Icon } from '@iconify/react'

const RegisterVirtualAccountMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid item xs={12} md={12}>
              <VirtualAccountTotalBalance handlePrev={handlePrev} handleNext={handleNext} />
            </Grid>
            <Grid item xs={12} md={12}>
              <CrmLastTransaction />
            </Grid>
          </>
        )

      case 1:
        return (
          <>
            <Grid item xs={12} md={12} sx={{ mr: 10 }}>
              <VirtualAccountDetails handlePrev={handlePrev} handleNext={handleNext} />
            </Grid>
          </>
        )

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  // console.log("logg form data", formData)

  return (
    <Grid container spacing={6} sx={{ width: '100%', my: 4, ml: 12 }}>
      <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(1)} !important`, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handlePrev}
            sx={{
              color: 'black',
              '& svg': { mr: 2 },
              ':hover': {
                bgcolor: 'secondary.luma'
              },
              p: 0
            }}
          >
            <Icon color='black' fontSize='1.125rem' icon='formkit:arrowleft' />
            Back
          </Button>
        </Box>
      </Grid>

      {/* <Button onClick={handleNext} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
              Deposit Now
            </Button> */}
      {renderContent()}
    </Grid>
  )
}

export default RegisterVirtualAccountMultiSteps
