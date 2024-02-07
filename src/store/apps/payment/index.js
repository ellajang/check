import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import PaymentDataService from 'src/services/PaymentService'

export const getExchangeRate = createAsyncThunk('appPayment/fetchEx', async (data, thunkApi) => {
  try {
    const response = await PaymentDataService.getEx(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getValidCurrencies = createAsyncThunk('appPayment/fetchValidCurrencies', async (data, thunkApi) => {
  try {
    const response = await PaymentDataService.getCurrencies(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getServiceFee = createAsyncThunk('appPayment/fetchFee', async (data, thunkApi) => {
  try {
    const response = await PaymentDataService.getFee(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getFxQuote = createAsyncThunk('appPayment/fetchFxQuote', async (data, thunkApi) => {
  try {
    const response = await PaymentDataService.getFxQ(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const confirmTransaction = createAsyncThunk('appPayment/fetchConfirmTransaction', async (data, thunkApi) => {
  try {
    const response = await PaymentDataService.getConfirmTx(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createVirtualAccount = createAsyncThunk('appPayment/createVirtualAccount', async (data, thunkApi) => {
  try {
    const response = await PaymentDataService.createVirtualAccount(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const initialState = {
  createTransaction: {
    collectionAmount: '',
    collectionCurrencyObj: '',
    collectionCurrency: '',
    collectionCountry: '',
    payoutCurrencyObj: '',
    payoutCurrency: '',
    payoutCountry: '',
    payoutAmount: '',
    paymentReason: '',
    invoiceNumber: '',
    invoiceFile: '',
    invoiceFileName: '',
    serviceFee: '',
    rate: ''
    // id: '',
    // uuid: '',
    // quote_id: '',
    // quote_key: ''
  },
  recipientDetails: {
    accountType: '',
    phoneCode: '',
    phoneNumber: '',
    name: '',
    email: '',
    regNumber: '',
    legalPersonName: '',
    bank: '',
    bankBranch: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    swiftBIC: ''
  },
  // recipientDetails: {
  //   accountType: 'BUSINESS',
  //   phoneCode: '+82',
  //   phoneNumber: '5656578787',
  //   name: 'Mosaic Restaurant',
  //   email: 'info@mosaic.com',
  //   regNumber: 'ATO121212',
  //   legalPersonName: 'Arya Tamang',
  //   bank: '054',
  //   bankBranch: '',
  //   accountName: 'Aryan Gurung',
  //   accountNumber: '8778778778',
  //   routingNumber: '1111',
  //   swiftBIC: 'HSBCKRSE'
  // },
  applicantDetails: {
    businessName: '',
    fullName: '',
    phoneNumber: '',
    doi: '',
    country: '',
    address: ''
  },
  // applicantDetails: {
  //   businessName: '',
  //   fullName: '',
  //   phoneNumber: '984343434',
  //   dob: '',
  //   nationality: '',
  //   address: '32 rohan drive,'
  // },
  transactionId: null,
  fxInfo: null,
  loading: false,
  validCurrencies: [],
  validCurrenciesError: null,
  serviceFeeError: null,
  serviceChargeError: null,
  exchangeError: null,
  confirmTransactionError: null,
  serviceFee: '',
  fxQuote: null,
  depositMethod: '',
  confirmTransactionResponse: '',
  virtualAccountError: '',
  virtualAccountResponse: '',
  VirtualAccountData: ''
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    loadUserData: (state, action) => {
      console.log('action', action.payload)
    },

    updateCreateTransaction: (state, action) => {
      console.log('action', action)
      state.createTransaction = action.payload
    },
    updateRecipientDetails: (state, action) => {
      console.log('action', action)
      state.recipientDetails = action.payload
    },
    updateApplicantDetails: (state, action) => {
      console.log('action', action)
      state.applicantDetails = action.payload
    },
    updateTansactionId: (state, action) => {
      console.log('action', action)
      state.transactionId = action.payload
    },
    updateVirtualAccount: (state, action) => {
      console.log('action', action)
      state.VirtualAccountData = action.payload
    },
    updateDepositMethod: (state, action) => {
      console.log('action', action)
      state.depositMethod = action.payload
    },
    resetFile: (state, action) => {
      state.createTransaction.invoiceFile = ''
      state.createTransaction.invoiceFileName = ''
    },
    resetConfirmScreen: (state, action) => {
      state.serviceChargeError = null
      state.finalServiceCharge = []
    },
    resetToast: (state, action) => {
      state.confirmTransactionResponse = ''
    },
    resetExchangeToast: (state, action) => {
      state.exchangeError = null
    },
    resetMakePaymentForm: (state, action) => {
      return initialState
    }
  },
  extraReducers: builder => {
    builder.addCase(getExchangeRate.pending, state => {
      state.loading = true
      state.exchangeError = null
    })
    builder.addCase(getExchangeRate.fulfilled, (state, { payload }) => {
      //console.log('hello payload', payload)
      //const { fx_info_response } = payload
      state.fxInfo = payload?.fx_info_response

      state.loading = false
    })
    builder.addCase(getExchangeRate.rejected, (state, { payload }) => {
      console.log('payload is', payload)
      state.loading = false
      state.exchangeError = payload?.message
    })

    builder.addCase(getValidCurrencies.pending, state => {
      state.loading = true
      state.validCurrenciesError = null
    })

    builder.addCase(getValidCurrencies.fulfilled, (state, { payload }) => {
      state.validCurrencies = payload?.valid_currencies_response?.collection_to_payout_rule
      state.loading = false
    })

    builder.addCase(getValidCurrencies.rejected, (state, { payload }) => {
      state.loading = false
      state.validCurrenciesError = payload?.message
    })

    builder.addCase(getServiceFee.pending, state => {
      state.loading = true
      state.serviceFeeError = null
    })

    builder.addCase(getServiceFee.fulfilled, (state, { payload }) => {
      state.serviceFee = payload?.service_fee_response?.service_fee
      state.loading = false
    })

    builder.addCase(getServiceFee.rejected, (state, { payload }) => {
      state.loading = false
      state.serviceFeeError = payload?.message
    })

    builder.addCase(getFxQuote.pending, state => {
      state.loading = true
      state.fxQuoteError = null
    })

    builder.addCase(getFxQuote.fulfilled, (state, { payload }) => {
      state.fxQuote = payload?.fx_info_response
      state.loading = false
    })

    builder.addCase(getFxQuote.rejected, (state, { payload }) => {
      state.loading = false
      state.fxQuoteError = payload?.message
    })

    builder.addCase(confirmTransaction.pending, state => {
      state.loading = true
      state.confirmTransactionError = null
    })

    builder.addCase(confirmTransaction.fulfilled, (state, { payload }) => {
      state.confirmTransactionResponse = payload
      state.loading = false
    })

    builder.addCase(confirmTransaction.rejected, (state, { payload }) => {
      state.loading = false
      state.confirmTransactionError = payload?.message
    })

    builder.addCase(createVirtualAccount.pending, state => {
      state.loading = true
      state.virtualAccountError = null
    })

    builder.addCase(createVirtualAccount.fulfilled, (state, { payload }) => {
      state.virtualAccountResponse = payload
      state.loading = false
    })

    builder.addCase(createVirtualAccount.rejected, (state, { payload }) => {
      state.loading = false
      state.virtualAccountError = payload?.message
    })
  }
})

export const {
  loadUserData,
  updateCreateTransaction,
  updateRecipientDetails,
  updateApplicantDetails,
  updateTansactionId,
  updateVirtualAccount,
  updateDepositMethod,
  resetConfirmScreen,
  resetToast,
  resetExchangeToast,
  resetMakePaymentForm,
  resetFile
} = paymentSlice.actions

export default paymentSlice.reducer
