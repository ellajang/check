// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** MUI Components
import Box from '@mui/material/Box'

// ** Demo Components Imports
//import StepperCustomVertical from 'src/views/onboard-merchant/StepperCustomVertical'
import RegisterMultiSteps from 'src/views/dashboards/get-paid'

import LayoutWithSideBar from 'src/layouts/LayoutWithSideBar'
import Typography from '@mui/material/Typography'

const GetPaid = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ width: 448, bgcolor: 'neutral.main', p: '20px', borderRadius: '8px' }}>
          {/* <Grid item xs={12}>
        <Box sx={{ width: 448 }}>
          <Typography variant='h3' sx={{ mb: 1.5 }}>
            Available Virtual Accounts{" "}
          </Typography>
        </Box>
      </Grid> */}
          <RegisterMultiSteps />
        </Box>
      </Grid>
    </Grid>
  )
}

GetPaid.getLayout = page => <LayoutWithSideBar>{page}</LayoutWithSideBar>

export default GetPaid

// GetPaid.guestGuard = true
