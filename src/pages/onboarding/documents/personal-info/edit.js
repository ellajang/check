// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import DetailsEditView from 'src/views/onboard-documents/personal-info/details-edit-view.js'

const DetailsEdit = () => <DetailsEditView />
DetailsEdit.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default DetailsEdit

// DetailsEdit.guestGuard = true

// layouts and centering is done here // use the view file for button click func
