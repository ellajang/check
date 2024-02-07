// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import AuthorityLetterView from 'src/views/onboard-documents/personal-info/authority-letter-view'

const AuthorityLetter = () => <AuthorityLetterView />
AuthorityLetter.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default AuthorityLetter

// AuthorityLetter.guestGuard = true

// layouts and centering is done here // use the view file for button click func
