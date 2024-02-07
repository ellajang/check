// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import StockholdersInfoView from 'src/views/onboard-documents/stockholders-info'

const StockholdersInfo = () => <StockholdersInfoView />
StockholdersInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default StockholdersInfo

// PersonalInfo.guestGuard = true

// layouts and centering is done here // use the view file for button click func
