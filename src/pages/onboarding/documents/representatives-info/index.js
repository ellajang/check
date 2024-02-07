// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import RepresentativesInfoView from 'src/views/onboard-documents/representatives-info'

const RepresentativesInfo = () => <RepresentativesInfoView />
RepresentativesInfo.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default RepresentativesInfo

// PersonalInfo.guestGuard = true

// layouts and centering is done here // use the view file for button click func
