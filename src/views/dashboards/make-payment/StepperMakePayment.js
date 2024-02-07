// ** React Imports
import { Fragment, useState, useEffect, forwardRef } from 'react'

import { useRouter } from 'next/navigation'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiStep from '@mui/material/Step'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/onboard-merchant/StepperCustomDot'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'

import { StepCreateTransaction } from './StepCreateTransaction'
import { StepRecipientDetails } from './StepRecipientDetails'
//import { StepRecipientDetails } from './StepTestAutocomplete'
import { StepApplicantDetails } from './StepApplicantDetails'
import { StepTransferConfirmation } from './StepTransferConfirmation'
//import StepRequestPlaced from '../get-paid/StepRequestPlaced'

import StepRequestPlaced from './StepRequestPlaced'
import { StepLocalCollection } from './StepLocalCollection'
import { StepLocalCollectionConfirmation } from './StepLocalCollectionConfirmation'

const mainSteps = [
  {
    icon: 'tabler:home',
    title: 'Create Payment',
    subtitle: 'Add Payment Details',
    subSteps: [{ label: 'Create Payment', progress: 90 }]
  },
  {
    icon: 'tabler:link',
    title: 'Enter Details',
    subtitle: 'Recipient and Sender',
    subSteps: [
      { label: "Recipient's Details", progress: 50 },
      { label: "Sender's Details", progress: 90 }
    ]
  },
  {
    icon: 'tabler:link',
    title: 'Submit Request',
    subtitle: 'Place Payment Request',
    subSteps: [
      { label: 'Confirmation', progress: 50 }
      // { label: 'Request Placed', progress: 100 }
    ]
  },
  {
    icon: 'tabler:link',
    title: 'Complete your payment',
    subtitle: 'Deposit to Virtual Account',
    subSteps: [
      { label: 'Complete your payment', progress: 30 },
      { label: 'Confirmation', progress: 60 },
      { label: 'Deposit Placed', progress: 100 }
    ]
  }
]

const QQConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0 !important',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

const StepperHeaderContainer = styled(CardContent)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)(({ theme }) => ({
  '&.Mui-completed .step-title': {
    fontSize: '16px'
  },
  '& .step-title': {
    fontSize: `18px !important`,
    letterSpacing: '.5px'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`,
    fontSize: `16px !important`,
    letterSpacing: '.5px'
  }
}))

//fc starts
const StepperMakePayment = () => {
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState(0)
  const [activeSubStep, setActiveSubStep] = useState(0)
  const [monthYear, setMonthYear] = useState(null)

  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { push, replace } = useRouter()

  const handleNext = () => {
    if (activeSubStep < mainSteps[activeStep].subSteps.length - 1) {
      setActiveSubStep(prev => prev + 1)
    } else if (activeStep < mainSteps.length - 1) {
      setActiveStep(prev => prev + 1)
      setActiveSubStep(0)
    }
  }

  const handleBack = () => {
    if (activeSubStep > 0) {
      setActiveSubStep(prev => prev - 1)
    } else if (activeStep > 0) {
      setActiveStep(prev => prev - 1)
      setActiveSubStep(mainSteps[activeStep - 1].subSteps.length - 1)
    } else if (activeStep === 0) {
      replace('/dashboard')
    }
  }

  const getStepContent = (row, column) => {
    const cases = {
      0: {
        0: () => <StepCreateTransaction handleBack={handleBack} handleNext={handleNext} />
      },
      1: {
        0: () => <StepRecipientDetails handleBack={handleBack} handleNext={handleNext} />,

        1: () => <StepApplicantDetails handleBack={handleBack} handleNext={handleNext} />
      },
      2: {
        0: () => <StepTransferConfirmation handleBack={handleBack} handleNext={handleNext} />
        // 1: () => <StepRequestPlaced handleNext={handleNext} />
      },
      3: {
        0: () => <StepLocalCollection handleBack={handleBack} handleNext={handleNext} />,
        1: () => <StepLocalCollectionConfirmation handleNext={handleNext} />,
        2: () => <StepRequestPlaced handleNext={handleNext} />
      }
    }

    if (cases[row] && cases[row][column]) {
      return cases[row][column]()
    } else {
      return 'Unknown Step'
    }
  }

  const extraProps = {
    mainSteps: mainSteps,
    activeStep: activeStep,
    activeSubStep: activeSubStep
  }

  const renderContent = () => {
    if (activeStep === mainSteps.length - 1) {
      return (
        <Grid container>
          {getStepContent(activeStep, activeSubStep)}
          {/* <Button onClick={onConfirmationClick} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
            <Translations text='Deposit Now' />
          </Button> */}
        </Grid>
      )
    } else {
      return (
        <Grid container>
          {getStepContent(activeStep, activeSubStep)}

          {/* <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(1)} !important`, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleBack}
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
                  Back
                </Button>
                <Button variant='contained' onClick={handleNext}>
                  Next
                </Button>
              </Box>
            </Grid> */}

          {/* <Button onClick={handleNext} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
              Deposit Now
            </Button> */}
        </Grid>
      )
    }
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        pt: 4,
        justifyContent: 'center',
        gap: 14,
        border: 0
      }}
    >
      <StepperHeaderContainer>
        <StepperWrapper sx={{ height: '100%' }}>
          <Stepper
            activeStep={activeStep}
            orientation='vertical'
            sx={{ minWidth: '16rem', mt: 12 }}
            connector={<QQConnector />}
          >
            {mainSteps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel StepIconProps={extraProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <div>
                        <Typography className='step-title' sx={{ fontSize: 4 }}>
                          <Translations text={step.title} />
                        </Typography>
                        <Typography className='step-subtitle' >
                          <Translations text={step.subtitle} />{' '}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </StepperHeaderContainer>
      {/* <Divider sx={{ m: '0 !important' }} /> */}
      <CardContent sx={{ maxWidth: '448px' }}>{renderContent()}</CardContent>
    </Card>
  )
} // fc ends

export default StepperMakePayment
