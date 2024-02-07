// ** React Imports
import { useState } from 'react'

// ** Step Components

import StepRecoverPassword from 'src/views/forgot-password/StepRecoverPassword'
import StepEmailSent from './StepEmailSent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

const ForgotPasswordMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const [email, setEmail] = useState('')

  // ** Hooks & Var
  const { settings } = useSettings()

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
        return <StepRecoverPassword handleNext={handleNext} setEmail={setEmail} />

      case 1:
        return <StepEmailSent handlePrev={handlePrev} email={email} />

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  return <>{renderContent()}</>
}

export default ForgotPasswordMultiSteps
