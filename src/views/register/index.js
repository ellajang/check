// ** React Imports
import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/navigation'

// ** Config
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

// ** Step Components
import StepAccountType from 'src/views/register/StepAccountType'
import StepCountryOfIncorporation from 'src/views/register/StepCountryOfIncorporation'
import StepEmail from 'src/views/register/StepEmail'
import StepEmailCode from 'src/views/register/StepEmailCode'
import StepPhoneNumber from 'src/views/register/StepPhoneNumber'
import StepPhoneOTP from 'src/views/register/StepPhoneOTP'
import StepPhoneOTP2 from 'src/views/register/StepPhoneOTP2'
import StepCreatePassword from 'src/views/register/StepCreatePassword'

import { resetErrorState } from 'src/store/apps/register'
import StepEmailOTP from './StepEmailOTP'

const RegisterMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.register)
  const auth = useAuth()

  const { push, replace } = useRouter()

  // Handle Stepper
  const handleNext = () => {
    dispatch(resetErrorState())
    setActiveStep(activeStep + 1)
  }

  const handlePrev = () => {
    dispatch(resetErrorState())
    if (activeStep === 4 || activeStep === 6) {
      setActiveStep(activeStep - 2)
    } else if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    } else if (activeStep === 0) {
      replace('/')
    }
  }

  const handleSkipToPhone = () => {
    setActiveStep(activeStep + 2)
    dispatch(resetErrorState())
  }

  const handleSkipToPassword = () => {
    setActiveStep(activeStep + 4)
    dispatch(resetErrorState())
  }

  const handlePasswordCreate = () => {
    console.log('password created')
    const useData = JSON.stringify({ ...userData?.user, ...userData?.user_entity_info })
    localStorage.setItem(authConfig.userData, useData)
    auth.setUser(JSON.parse(useData))
    push('/onboarding')
    dispatch(resetErrorState())
  }

  const handleSkipPhone = () => {
    setActiveStep(activeStep + 2)
    dispatch(resetErrorState())
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <StepAccountType handlePrev={handlePrev} handleNext={handleNext} />

      case 1:
        return <StepCountryOfIncorporation handlePrev={handlePrev} handleNext={handleNext} />

      case 2:
        return (
          <StepEmail
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSkipToPhone={handleSkipToPhone}
            handleSkipToPassword={handleSkipToPassword}
          />
        )

      case 3:
        //return <StepEmailCode handlePrev={handlePrev} handleNext={handleNext} />
        return <StepEmailOTP handlePrev={handlePrev} handleNext={handleNext} />

      case 4:
        return <StepPhoneNumber handlePrev={handlePrev} handleNext={handleNext} handleSkipPhone={handleSkipPhone} />
        

      case 5:
        //return <StepPhoneOTP handlePrev={handlePrev} handleNext={handleNext} />
        return <StepPhoneOTP2 handlePrev={handlePrev} handleNext={handleNext} />

      case 6:
        return (
          <StepCreatePassword
            handlePrev={handlePrev}
            handleNext={handleNext}
            handlePasswordCreate={handlePasswordCreate}
          />
        )

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  return <>{renderContent()}</>
}

export default RegisterMultiSteps
