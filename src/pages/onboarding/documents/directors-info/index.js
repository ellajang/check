// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import DirectorsInfoView from 'src/views/onboard-documents/directors-info'

const DirectorsInfo = () => <DirectorsInfoView />
DirectorsInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default DirectorsInfo

// PersonalInfo.guestGuard = true

// layouts and centering is done here // use the view file for button click func
