import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import BankInfoView from 'src/views/onboard-documents/bank-info'

const BankInfo = () => <BankInfoView />
BankInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default BankInfo

// BankInfo.guestGuard = true
