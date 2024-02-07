// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import BusinessInfoView from 'src/views/onboard-documents/business-info'

const BusinessInfo = () => <BusinessInfoView />
BusinessInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default BusinessInfo

// BusinessInfo.guestGuard = true

// layouts and centering is done here // use the view file for button click func
