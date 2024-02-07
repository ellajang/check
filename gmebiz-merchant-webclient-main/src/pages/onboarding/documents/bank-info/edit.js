import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import DetailsEditView from 'src/views/onboard-documents/bank-info/details-edit-view'

const DetailsEdit = () => <DetailsEditView />
DetailsEdit.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default DetailsEdit

// DetailsEdit.guestGuard = true
