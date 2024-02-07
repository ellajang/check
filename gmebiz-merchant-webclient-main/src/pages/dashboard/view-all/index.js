import React from 'react'

import ShowAllTransactionsView from 'src/views/dashboards/view-all'

// ** Layout Import
import LayoutWithSideBar from 'src/layouts/LayoutWithSideBar'

export default function ViewAllTransactions() {
  return <ShowAllTransactionsView />
}

ViewAllTransactions.getLayout = page => <LayoutWithSideBar>{page}</LayoutWithSideBar>
