// ** MUI Imports

// ** Layout Import
import LayoutWithSideBar from 'src/layouts/LayoutWithSideBar'
import RegisterVirtualAccountMultiSteps from 'src/views/dashboards/balance'

//merchant overview

const BalanceDetails = () => {
  return <RegisterVirtualAccountMultiSteps />
}

BalanceDetails.getLayout = page => <LayoutWithSideBar>{page}</LayoutWithSideBar>

export default BalanceDetails

// BalanceDetails.guestGuard = true
