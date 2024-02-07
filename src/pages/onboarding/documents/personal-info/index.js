// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import PersonalInfoView from 'src/views/onboard-documents/personal-info'

const PersonalInfo = () => <PersonalInfoView />
PersonalInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default PersonalInfo

// PersonalInfo.guestGuard = true

// layouts and centering is done here // use the view file for button click func
