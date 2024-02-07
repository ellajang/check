import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import IncorporationDocumentView from 'src/views/onboard-documents/business-info/incorporation-documents-view'

const businessDocument = () => <IncorporationDocumentView />
businessDocument.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default businessDocument

// BankPassbook.guestGuard = true
