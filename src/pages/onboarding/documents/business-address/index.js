// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import BusinessAddressInfoView from 'src/views/onboard-documents/business-address'

const BusinessAddressInfo = () => <BusinessAddressInfoView />
BusinessAddressInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default BusinessAddressInfo

// PersonalInfo.guestGuard = true

// layouts and centering is done here // use the view file for button click func
