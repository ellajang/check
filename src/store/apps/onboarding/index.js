import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import OnboardingDataService from 'src/services/OnboardingService'

const initialState = {
  personalDetails: {
    firstName: '',
    middleName: '',
    lastName: '',
    fullNameNative: '',
    dob: ''
  },
  countryOfResidence: {
    country: ''
  },
  businessDetails: {
    phone: '',
    phoneCode: '',
    legalBusinessName: '',
    businessNameNative: '',
    businessType: '',
    registrationNumber: '',
    doi: '',
    businessWebsite: ''
  },
  natureOfBusiness: {
    industryType: '',
    productType: '',
    nob: '',
    describe: ''
  },
  businessAddress: {
    country: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
    city: ''
  },
  companyRepresentative: [],
  listOfStockholders: [],
  listOfDirectors: [],
  bankDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    swiftBic: '',
    ifscCode: '',
    cardNumber: ''
  },
  almostThereSelection: {
    makePayment: [],
    getPaid: []
  },
  almostThereMonthly: {
    monthlyRevenue: ''
  },
  merchantPersonalDetails: {},
  merchants: [],
  merchantBanks: [],
  representatives: [],
  stockholders: [],
  directors: [],
  onboardingStatus: {},
  documents: [],
  responseStatus: null,
  onboardLoading: false,
  message: null,
  messageCode: null,
  error: null
}

export const getMerchantPersonalDetails = createAsyncThunk(
  'appONB/getMerchantPersonalDetails',
  async (Data, thunkApi) => {
    try {
      const response = await OnboardingDataService.getMerchantPersonalDetails(Data)

      return response.data
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const getMerchants = createAsyncThunk('appONB/getMerchants', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getMerchants(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getMerchantBanks = createAsyncThunk('appONB/getMerchantBanks', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getMerchantBanks(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getRepresentatives = createAsyncThunk('appONB/getRepresentatives', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getRepresentatives(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const deleteRepresentatives = createAsyncThunk('appONB/deleteRepresentatives', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getRepresentatives(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getStockholders = createAsyncThunk('appONB/getStockholders', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getStockholders(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const deleteStockholders = createAsyncThunk('appONB/deleteStockholders', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getStockholders(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const deleteDirectors = createAsyncThunk('appONB/deleteDirectors', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getDirectors(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getDirectors = createAsyncThunk('appONB/getDirectors', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getDirectors(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getOnboardingStatus = createAsyncThunk('appONB/getOnboardingStatus', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getOnboardingStatus(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createMerchantOnboarding = createAsyncThunk('appONB/createMerchantOnboarding', async (Data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantOnboarding(Data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createPersonalDetails = createAsyncThunk('appONB/createPersonalDetails', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantPersonalDetails(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createCountryOfResidence = createAsyncThunk('appONB/createCountryOfResidence', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantOnboarding(state)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createBusinessDetails = createAsyncThunk('appONB/createBusinessDetails', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantOnboarding(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createNatureOfBusiness = createAsyncThunk('appONB/createNatureOfBusiness', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantOnboarding(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createBusinessAddress = createAsyncThunk('appONB/createBusinessAddress', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantOnboarding(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createCompanyRepresentative = createAsyncThunk(
  'appONB/createCompanyRepresentative',
  async (data, thunkApi) => {
    try {
      const response = await OnboardingDataService.createRepresentatives(data)

      return response.data
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const createListOfStockholders = createAsyncThunk('appONB/createListOfStockholders', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createStockholders(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createListOfDirectors = createAsyncThunk('appONB/createListOfDirectors', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createDirectors(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createBankDetails = createAsyncThunk('appONB/createBankDetails', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createMerchantBanks(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createDocuments = createAsyncThunk('appONB/createDocuments', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.createDocuments(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getDocuments = createAsyncThunk('appONB/getDocuments', async (data, thunkApi) => {
  try {
    const response = await OnboardingDataService.getDocuments(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const onboardingSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetOnboardingStatus: (state, action) => {
      console.log('reset', action)
      state.responseStatus = null
      state.message = null
      state.messageCode = null
      state.error = null
    },
    updatePersonalDetails: (state, action) => {
      state.personalDetails = action.payload
    },
    updateCountryOfResidence: (state, action) => {
      state.countryOfResidence = action.payload
    },
    updateBusinessDetails: (state, action) => {
      state.businessDetails = action.payload
    },
    updateNatureOfBusiness: (state, action) => {
      state.natureOfBusiness = action.payload
    },
    updateBusinessAddress: (state, action) => {
      state.businessAddress = action.payload
    },
    updateCompanyRepresentative: (state, action) => {
      state.companyRepresentative = action.payload
    },
    updateListOfStockholders: (state, action) => {
      state.listOfStockholders = action.payload
    },
    updateListOfDirectors: (state, action) => {
      state.listOfDirectors = action.payload
    },
    updateBankDetails: (state, action) => {
      state.bankDetails = action.payload
    },
    updateAlmostThereSelection: (state, action) => {
      state.almostThereSelection = action.payload
    },
    updateAlmostThereMonthly: (state, action) => {
      state.almostThereMonthly = action.payload
    },
    resetCompanyRepresentative: (state, action) => {
      state.companyRepresentative = initialState.companyRepresentative
    },
    resetListOfStockholders: (state, action) => {
      state.listOfStockholders = initialState.listOfStockholders
    },
    resetListOfDirectors: (state, action) => {
      state.listOfDirectors = initialState.listOfDirectors
    },
    resetCompanyRepresentativeFile: (state, action) => {
      state.companyRepresentative.idCopy = []
    },
    resetOnboarding: (state, action) => {
      return initialState
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getMerchantBanks.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(getMerchantBanks.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
        state.merchantBanks = action.payload?.merchants_bank_details?.merchant_bank_details
      })
      .addCase(getMerchantBanks.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(getMerchantPersonalDetails.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(getMerchantPersonalDetails.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.merchantPersonalDetails = action.payload?.user?.user
        state.messageCode = action.payload?.message_code
      })
      .addCase(getMerchantPersonalDetails.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(getMerchants.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(getMerchants.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.merchants = action.payload?.merchant?.merchants
        state.messageCode = action.payload?.message_code
      })
      .addCase(getMerchants.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(getRepresentatives.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(getRepresentatives.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.representatives = action.payload?.merchants_representatives_details?.merchant_representative_details
        state.messageCode = action.payload?.message_code
      })
      .addCase(getRepresentatives.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(deleteRepresentatives.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(deleteRepresentatives.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(deleteRepresentatives.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(getStockholders.pending, (state, action) => {
        state.onboardLoading = true
        state.responseStatus = null
      })
      .addCase(getStockholders.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.stockholders = action.payload?.merchants_stockholders_details?.merchants_stockholders_details
        state.messageCode = action.payload?.message_code
      })
      .addCase(getStockholders.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(deleteStockholders.pending, (state, action) => {
        state.onboardLoading = true
        state.responseStatus = null
      })
      .addCase(deleteStockholders.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(deleteStockholders.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(deleteDirectors.pending, (state, action) => {
        state.onboardLoading = true
        state.responseStatus = null
      })
      .addCase(deleteDirectors.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(deleteDirectors.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(getDirectors.pending, (state, action) => {
        state.onboardLoading = true
        state.responseStatus = null
      })
      .addCase(getDirectors.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.directors = action.payload?.merchants_directors_details?.merchant_directors_details
        state.messageCode = action.payload?.message_code
      })
      .addCase(getDirectors.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(getOnboardingStatus.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(getOnboardingStatus.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.onboardingStatus = action.payload?.merchant_kyc_response?.merchant_kyc_status
        state.messageCode = action.payload?.message_code
      })
      .addCase(getOnboardingStatus.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(createMerchantOnboarding.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(createMerchantOnboarding.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createMerchantOnboarding.rejected, (state, action) => {
        state.onboardLoading = false
        state.error = action.payload?.message
        state.responseStatus = null
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })
    builder
      .addCase(createPersonalDetails.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(createPersonalDetails.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createPersonalDetails.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(createBusinessDetails.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(createBusinessDetails.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createBusinessDetails.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(createBusinessAddress.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(createBusinessAddress.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createBusinessAddress.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(createCompanyRepresentative.pending, (state, action) => {
        state.onboardLoading = true
        state.error = null
        state.message = null
      })
      .addCase(createCompanyRepresentative.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createCompanyRepresentative.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.message = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(createListOfStockholders.pending, (state, action) => {
        state.onboardLoading = true
        state.responseStatus = null
      })
      .addCase(createListOfStockholders.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createListOfStockholders.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(createListOfDirectors.pending, (state, action) => {
        state.onboardLoading = true
        state.responseStatus = null
      })
      .addCase(createListOfDirectors.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createListOfDirectors.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(createBankDetails.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(createBankDetails.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createBankDetails.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(createDocuments.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(createDocuments.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(createDocuments.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })

    builder
      .addCase(getDocuments.pending, (state, action) => {
        state.onboardLoading = true
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.onboardLoading = false
        state.responseStatus = action.payload?.status
        state.message = action.payload?.message
        state.messageCode = action.payload?.message_code
        state.documents = action.payload?.documents?.documents
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.onboardLoading = false
        state.responseStatus = null
        state.error = action.payload?.message
        state.messageCode = action.payload?.message
        state.message = action.payload?.message
      })
  }
})

export const {
  resetOnboarding,
  resetOnboardingStatus,
  updateStep,
  updatePersonalDetails,
  updateCountryOfResidence,
  updateBusinessDetails,
  updateNatureOfBusiness,
  updateBusinessAddress,
  updateCompanyRepresentative,
  updateListOfStockholders,
  updateListOfDirectors,
  updateBankDetails,
  updateAlmostThereSelection,
  updateAlmostThereMonthly,
  resetCompanyRepresentative,
  resetListOfStockholders,
  resetListOfDirectors,
  resetCompanyRepresentativeFile,
  resetStatus
} = onboardingSlice.actions

export default onboardingSlice.reducer
