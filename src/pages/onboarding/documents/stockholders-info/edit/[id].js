// ** Layout Import
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Component Import
import DetailsEditView from 'src/views/onboard-documents/stockholders-info/details-edit-view'

const DetailsEdit = () => {
  return <DetailsEditView />
}
DetailsEdit.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

export default DetailsEdit

// DetailsEdit.guestGuard = true

// layouts and centering is done here // use the view file for button click func
