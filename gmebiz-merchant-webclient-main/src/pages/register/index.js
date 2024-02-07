// ** MUI Components
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Configs
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Components Imports
import RegisterMultiStepsWizard from 'src/views/register'

const SignupWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  }
}))

const RegisterMultiSteps = () => {
  return (
    <SignupWrapper>
      <Box className='content-center'>
        <Box sx={{ width: 448, height: 600 }}>
          <RegisterMultiStepsWizard />
        </Box>
      </Box>
    </SignupWrapper>
  )
}

//RegisterMultiSteps.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>
RegisterMultiSteps.guestGuard = true

export default RegisterMultiSteps
