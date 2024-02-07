// ** MUI Components
import Box from '@mui/material/Box'

// ** Configs
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Demo Components Imports

import ForgotPasswordMultiStepsWizard from 'src/views/forgot-password'

// ** Styled Components

const ForgotPasswordMultiSteps = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ width: 448 }}>
        <ForgotPasswordMultiStepsWizard />
      </Box>
    </Box>
  )
}

ForgotPasswordMultiSteps.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default ForgotPasswordMultiSteps

ForgotPasswordMultiSteps.guestGuard = true
