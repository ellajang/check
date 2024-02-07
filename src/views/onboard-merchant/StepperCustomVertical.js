// ** React Imports
import { useState } from 'react'

// ** MUI Imports

import Card from '@mui/material/Card'

import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'

import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiStep from '@mui/material/Step'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import StepperCustomGetStarted from './StepperCustomGetStarted'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'

// ** Styled Component

import StepPersonalDetails from './StepPersonalDetails'
import StepCountryOfResidence from './StepCountryOfResidence'
import StepBusinessDetails from './StepBusinessDetails'
import StepNatureOfBusiness from './StepNatureOfBusiness'
import StepBusinessAddress from './StepBusinessAddress'
import StepCompanyRepresentative from './StepCompanyRepresentative'
import StepListCompanyRepresentative from './StepListCompanyRepresentative'
import StepListOfStockholders from './StepListOfStockholders'
import StepStockholdersList from './StepStockholdersList'
import StepListOfDirectors from './StepListOfDirectors'
import StepDirectorsList from './StepDirectorsList'
import StepBankDetails from './StepBankDetails'
import GoBack from './GoBack'
import AlmostThere from './AlmostThere'
import AlmostThereMonthly from './AlmostThereMonthly'
import Translations from 'src/layouts/components/Translations'

const mainSteps = [
  {
    title: 'Get Started'
  },
  {
    icon: 'tabler:home',
    title: "Applicant's Identity",
    subtitle: "Applicant's Details",
    subSteps: [
      { label: "Applicant's Details", progress: 30 },
      { label: 'Country of Residence', progress: 50 }
    ]
  },
  {
    icon: 'tabler:link',
    title: 'Business Profile',
    subtitle: 'Industry and location details',
    subSteps: [
      { label: 'Business Details', progress: 30 },
      { label: 'Nature of Business', progress: 50 },
      { label: 'Business Address', progress: 75 }
    ]
  },
  {
    icon: 'tabler:link',
    title: 'Business Owner',
    subtitle: 'List of business owners',
    subSteps: [
      { label: 'Representative', progress: 30 },
      { label: 'List Company Representatives', progress: 30 },
      { label: 'List of Stockholders', progress: 50 },
      { label: 'Stockholders List', progress: 50 },
    ]
  },
  {
    icon: 'tabler:link',
    title: 'Bank Details',
    subtitle: 'Business banking details',
    subSteps: [{ label: 'Bank Details', progress: 100 }]
  }
]

// { label: 'List of directors', progress: 75 },
// { label: 'Directors List', progress: 75 }

const QQConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0 !important',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

const StepperHeaderContainer = styled(CardContent)(({ theme }) => ({
  // borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)(({ theme }) => ({
  // '&.Mui-completed .MuiSvgIcon-root': {
  //   color: '#000000'
  // },
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

const StepperCustomVertical = ({ handleState }) => {
  const theme = useTheme()
  const { direction } = theme

  const [activeStep, setActiveStep] = useState(1)
  const [activeSubStep, setActiveSubStep] = useState(0)

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const handleNext = () => {
    if (activeSubStep < mainSteps[activeStep].subSteps.length - 1) {
      setActiveSubStep(prev => prev + 1)
    } else if (activeStep < mainSteps.length - 1) {
      setActiveStep(prev => prev + 1)
      setActiveSubStep(0)
    }
  }

  // currently handle next and handle skip functions the same but later handle next will have validation checks
  const handleSkip = () => {
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
    } else if (activeStep > 1) {
      setActiveStep(prev => prev - 1)
      setActiveSubStep(mainSteps[activeStep - 1].subSteps.length - 1)
    }
  }

  const handleSkipCompanyRep = () => {
    setActiveStep(3)
    setActiveSubStep(2)
  }

  const handleSkipStockHolders = () => {
    setActiveStep(3)
    setActiveSubStep(4)
  }

  const handleSkipDirectors = () => {
    setActiveStep(4)
    setActiveSubStep(0)
  }

  const handleSkipAlmostThere = () => {
    setActiveStep(5)
    setActiveSubStep(1)
  }

  const handleBackBank = () => {
    setActiveStep(4)
    setActiveSubStep(0)
  }

  const handleBackAlmost = () => {
    setActiveStep(5)
    setActiveSubStep(0)
  }

  const handleNextBank = () => {
    setActiveStep(5)
    setActiveSubStep(0)
  }

  const handleNextAlmost = () => {
    setActiveStep(5)
    setActiveSubStep(1)
  }

  const handleSplashState = () => {
    handleState()
  }

    // 4: () => {
    //   return (
    //     <>
    //       <GoBack handleBack={handleBack} />
    //       <StepListOfDirectors handleNext={handleNext} handleBack={handleBack} />
    //     </>
    //   )
    // },
    // 5: () => {
    //   return (
    //     <>
    //       <GoBack handleBack={handleBack} handleSkip={handleSkip} />
    //       <StepDirectorsList handleNext={handleNext} handleBack={handleBack} />
    //     </>
    //   )
    // }

  const getStepContent = (row, column) => {
    const cases = {
      1: {
        0: () => {
          return (
            <>
              <GoBack handleSplashState={handleSplashState} handleBack={handleBack} />
              <StepPersonalDetails handleNext={handleNext} />
            </>
          )
        },
        1: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepCountryOfResidence handleNext={handleNext} />
            </>
          )
        }
      },
      2: {
        0: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepBusinessDetails handleNext={handleNext} />
            </>
          )
        },
        1: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepNatureOfBusiness handleNext={handleNext} />
            </>
          )
        },
        2: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepBusinessAddress handleNext={handleNext} />
            </>
          )
        }
      },
      3: {
        0: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepCompanyRepresentative handleNext={handleNext} />
            </>
          )
        },
        1: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepListCompanyRepresentative handleNext={handleNext} handleBack={handleBack} />
            </>
          )
        },
        2: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepListOfStockholders handleNext={handleNext} handleBack={handleBack} />
            </>
          )
        },
        3: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepStockholdersList handleNext={handleNext} handleBack={handleBack} />
            </>
          )
        }
      },
      4: {
        0: () => {
          return (
            <>
              <GoBack handleBack={handleBack} />
              <StepBankDetails handleNext={handleNextBank} />
            </>
          )
        }
      },
      5: {
        0: () => {
          return (
            <>
              <GoBack handleBack={handleBackBank} handleSkip={handleSkipAlmostThere} />
              <AlmostThere handleNext={handleNextAlmost} />
            </>
          )
        },
        1: () => {
          return (
            <>
              <GoBack handleBack={handleBackAlmost} />
              <AlmostThereMonthly />
            </>
          )
        }
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
      {activeStep < mainSteps.length && (
        <>
          <StepperHeaderContainer>
            <StepperWrapper sx={{ height: '100%' }}>
              <Stepper
                activeStep={activeStep}
                orientation='vertical'
                sx={{ minWidth: '16rem', mt: 12 }}
                connector={<QQConnector />}
              >
                {mainSteps.map((step, index) => {
                  if (index === 0) {
                    return (
                      <Step key={index}>
                        <StepLabel StepIconComponent={StepperCustomGetStarted}>
                          <div className='step-label'>
                            <div>
                              <Typography className='step-title' sx={{ fontSize: 4 }}>
                                <Translations text='Get Started' />
                              </Typography>
                              <Typography className='step-subtitle'>
                                <Translations text='Basic account creation' />
                              </Typography>
                            </div>
                          </div>
                        </StepLabel>
                      </Step>
                    )
                  }

                  return (
                    <Step key={index}>
                      <StepLabel StepIconProps={extraProps} StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <div>
                            <Typography className='step-title' sx={{ fontSize: 4 }}>
                              <Translations text={step.title} />
                            </Typography>
                            <Typography className='step-subtitle'>
                              <Translations text={step.subtitle} />
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
          {!hidden && <Divider sx={{ m: '0 !important' }} />}
        </>
      )}
      <CardContent sx={{ maxWidth: '448px' }}>{getStepContent(activeStep, activeSubStep)}</CardContent>
    </Card>
  )
}

export default StepperCustomVertical
