// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiStep from '@mui/material/Step'
import MuiStepper from '@mui/material/Stepper'
import CardContent from '@mui/material/CardContent'
import StepContent from '@mui/material/StepContent'

// ** Third Party Imports
import clsx from 'clsx'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Step Components
import StepDealType from 'src/views/pages/wizard-examples/create-deal/StepDealType'
import StepReview from 'src/views/pages/wizard-examples/create-deal/StepReview'
import StepDealUsage from 'src/views/pages/wizard-examples/create-deal/StepDealUsage'
import StepDealDetails from 'src/views/pages/wizard-examples/create-deal/StepDealDetails'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    title: 'Get Started',
    subtitle: 'Basic account creation',
    description:
      'Chocolate cookie lollipop toffee candy canes marzipan liquorice chocolate. Cake gummi bears dessert lollipop apple pie candy. Candy pie sesame snaps lollipop biscuit chocolate cake fruitcake apple pie. Toffee carrot cake biscuit oat cake jujubes fruitcake biscuit gummi bears. Cake carrot cake jujubes sugar plum pastry gummi bears gingerbread icing. Lemon drops pie cake. Halvah marzipan bonbon gingerbread cupcake pastry gummi bears cake jujubes.'
  },
  {
    title: 'Applicants Identity',
    subtitle: 'Personal details',
    description:
      'Lemon drops ice cream danish macaroon bear claw cookie. Liquorice ice cream chocolate bar pastry chocolate bar candy. Caramels candy canes marshmallow soufflé biscuit tart fruitcake tiramisu. Gummi bears icing gingerbread pastry bonbon gummies candy canes pastry. Candy canes chocolate chupa chups cake cheesecake apple pie halvah dessert. Chupa chups wafer tootsie roll fruitcake lemon drops cookie donut topping powder.'
  },
  {
    title: 'Business Profile',
    subtitle: 'Industry and location details',
    description:
      'Jelly lollipop halvah bear claw jujubes macaroon candy canes. Soufflé halvah lollipop liquorice macaroon powder. Cookie topping pastry oat cake caramels bonbon. Sesame snaps sweet cookie macaroon soufflé pudding. Chocolate donut macaroon muffin donut biscuit marzipan halvah. Bear claw biscuit chocolate cake chupa chups oat cake bear claw cupcake tiramisu apple pie. Carrot cake bear claw marshmallow sweet pudding toffee.'
  },
  {
    title: 'Business Owner',
    subtitle: 'List of business owners'
  },
  {
    title: 'Bank Details',
    subtitle: 'Business banking details'
  }
]

const StepperHeaderContainer = styled(CardContent)(({ theme }) => ({
  //borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const CreateDealWizard = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  // ** Hook
  const theme = useTheme()

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
        return <StepDealType />
      case 1:
        return <StepDealDetails />

      // case 2:
      //   return <StepDealUsage />
      // case 3:
      //   return <StepReview />
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='tonal'
          color='secondary'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon={theme.direction === 'ltr' ? 'tabler:arrow-left' : 'tabler:arrow-right'} />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          color={stepCondition ? 'success' : 'primary'}
          onClick={() => (stepCondition ? alert('Submitted..!!') : handleNext())}
          endIcon={
            <Icon
              icon={
                stepCondition ? 'tabler:check' : theme.direction === 'ltr' ? 'tabler:arrow-right' : 'tabler:arrow-left'
              }
            />
          }
        >
          {stepCondition ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, pt: 4, pl: 30 }}>
      <StepperHeaderContainer>
        <StepperWrapper>
          <Stepper activeStep={activeStep} orientation='vertical' sx={{ mt: 14 }}>
            {steps.map((step, index) => {
              return (
                <Step key={index} className={clsx({ active: activeStep === index })}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </StepperHeaderContainer>
      <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important`, maxWidth: '448px', ml: 30 }}>
        {renderContent()}
        {/* {renderFooter()} */}
      </CardContent>
    </Card>
  )
}

export default CreateDealWizard
