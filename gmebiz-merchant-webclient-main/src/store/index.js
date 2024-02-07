// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers

import user from 'src/store/apps/user'
import auth from 'src/store/apps/auth'
import register from 'src/store/apps/register'
import category from 'src/store/apps/category'
import onboarding from 'src/store/apps/onboarding'
import payment from 'src/store/apps/payment'
import profile from 'src/store/apps/profile'
import transaction from 'src/store/apps/transaction'
import notification from "./apps/notification";
import documents from "./apps/document";

export const store = configureStore({
  reducer: {
    auth,
    user,
    register,
    category,
    onboarding,
    payment,
    profile,
    transaction,
    notification,
    documents
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
