// ** React Imports
import { useState } from "react"

// ** Step Components
import StepVirtualAccountList from "./StepVirtualAccountList"
import StepVirtualAccountAdd from "./StepVirtualAccountAdd"
import StepRequestPlace from "./StepRequestPlaced"

const RegisterMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const [formData, setFormData] = useState({
    accountType: {
      name: ["CAD Account", "GBP Account", "KRW Account", "SGD Account", "USD Account"],
      flag: ["canada", "great-britain", "south-korea", "singapore", "usa"]
    }
  })

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
        return <StepVirtualAccountList handleNext={handleNext} formData={formData} setFormData={setFormData} />

      //return <StepBeta handleNext={handleNext} formData={formData} setFormData={setFormData} />

      case 1:
        return (
          <StepVirtualAccountAdd
            handlePrev={handlePrev}
            handleNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )

      case 2:
        return (
          <StepRequestPlace
            handlePrev={handlePrev}
            handleNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  // console.log("logg form data", formData)

  return <>{renderContent()}</>
}

export default RegisterMultiSteps
