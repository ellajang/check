// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
//import StepperCustomVertical from 'src/views/onboard-merchant/StepperCustomVertical'

import StepperMakePayment from 'src/views/dashboards/make-payment/StepperMakePayment'

import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

const MakePayment = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StepperMakePayment />
      </Grid>
    </Grid>
  )
}

MakePayment.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default MakePayment

//MakePayment.guestGuard = true
