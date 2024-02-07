import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import BankPassbookView from 'src/views/onboard-documents/bank-info/bank-passbook-view'

const BankPassbook = () => <BankPassbookView />
BankPassbook.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default BankPassbook

// BankPassbook.guestGuard = true
