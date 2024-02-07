import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import CategoryDataService from 'src/services/CategoryService'

const initialState = {
  countries: [],
  phoneCodes: [],
  localCountry: '',
  localPhoneCode: '',
  incCountries: [],
  businessTypes: [],
  businessAddressHtml: [],
  searchPage: 1,
  accountTypes: [],
  paymentReasons: [],
  industryTypes: [],
  productTypes: [],
  designations: [],
  nationalities: [],
  languages: [],
  makePaymentPaidType: [],
  monthlyRevenueType: [],
  banks: [],
  branch: [],
  loading: false,
  businessAddressLoading: false,
  error: null,
  countryError: null,
  incCountryError: null,
  phoneCodeError: null,
  businessTypeError: null,
  accountTypeError: null,
  paymentReasonError: null,
  industryTypesError: null,
  productTypesError: null,
  designationsError: null,
  nationalitiesError: null,
  languageError: null,
  makePaymentPaidTypeError: null,
  monthlyRevenueTypeError: null,
  banksError: null,
  branchError: null,
  geoInfoError: null,
  redirectionPage: null,
  businessAddressStatus: null,
}

export const getAllCountries = createAsyncThunk('appCategory/fetchCountries', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getIncCountries = createAsyncThunk('appCategory/fetchIncCountries', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getIncCountries(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllPhoneCodes = createAsyncThunk('appCategory/fetchPhoneCodes', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllBusinessTypes = createAsyncThunk('appCategory/fetchBusinessTypes', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllAccountTypes = createAsyncThunk('appCategory/fetchAccountTypes', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllPaymentReasons = createAsyncThunk('appCategory/fetchPaymentReasons', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllIndustryTypes = createAsyncThunk('appCategory/fetchIndustryTypes', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllProductTypes = createAsyncThunk('appCategory/fetchProductTypes', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllDesignations = createAsyncThunk('appCategory/fetchDesignations', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllNationalities = createAsyncThunk('appCategory/fetchNationalities', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllMakePaymentPaidType = createAsyncThunk(
  'appCategory/fetchMakePaymentPaidType',
  async (data, thunkApi) => {
    try {
      const response = await CategoryDataService.getAll(data)

      return response.data
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const getAllMonthlyRevenueType = createAsyncThunk(
  'appCategory/fetchMonthlyRevenueType',
  async (data, thunkApi) => {
    try {
      const response = await CategoryDataService.getAll(data)

      return response.data
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const getAllBanks = createAsyncThunk('appCategory/fetchBanks', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getBanks(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getBankBranch = createAsyncThunk('appCategory/fetchBankBranch', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getBranch(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllLanguages = createAsyncThunk('appCategory/fetchLanguages', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getAll(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllAddress = createAsyncThunk('appCategory/fetchAddress', async (data, thunkApi) => {
  try {
    const postData= {
      "function": "SEARCH",
      "scope": "BYKEYWORD",
      "data": {
        "query_params": data
      }
    }
    const response = await CategoryDataService.getAddress(postData)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getGeoInfo = createAsyncThunk('appCategory/getGeoInfo', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getGeoInfo(data)

    const countries = await response.json()

    // console.log('response response data', response.data)

    // return response.data
    return countries
  } catch (error) {
    console.log('error getting geo info')
    // return thunkApi.rejectWithValue(error)
  }
})

export const getLandingPage = createAsyncThunk('appCategory/fetchLandingPage', async (data, thunkApi) => {
  try {
    const response = await CategoryDataService.getLanding(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    resetCategoryState: state => {
      return initialState
    },
    updatePreviousPage: state => {
      state.searchPage = state.searchPage - 1
    },
    updateNextPage: state => {
      state.searchPage = state.searchPage + 1
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllCountries.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.countries = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllCountries.pending, (state, { payload }) => {
      state.loading = true
      state.countryError = null
    })
    builder.addCase(getAllCountries.rejected, (state, { payload }) => {
      state.loading = false
      state.countryError = payload?.message
    })

    builder.addCase(getIncCountries.fulfilled, (state, { payload }) => {
      const { countries } = payload
      state.incCountries = countries?.countries
      state.loading = false
    })
    builder.addCase(getIncCountries.pending, (state, { payload }) => {
      state.loading = true
      state.incCountryError = null
    })
    builder.addCase(getIncCountries.rejected, (state, { payload }) => {
      state.loading = false
      state.incCountryError = payload?.message
    })

    builder.addCase(getAllLanguages.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.languages = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllLanguages.pending, (state, { payload }) => {
      state.loading = true
      state.languageError = null
    })
    builder.addCase(getAllLanguages.rejected, (state, { payload }) => {
      state.loading = false
      state.languageError = payload?.message
    })

    builder.addCase(getAllPhoneCodes.pending, (state, { payload }) => {
      state.loading = true
      state.phoneCodeError = null
    })

    builder.addCase(getAllPhoneCodes.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.phoneCodes = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllPhoneCodes.rejected, (state, { payload }) => {
      state.loading = false
      state.phoneCodeError = payload?.message
    })

    builder.addCase(getAllBusinessTypes.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.businessTypes = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllBusinessTypes.pending, (state, { payload }) => {
      state.loading = true
      state.businessTypeError = null
    })
    builder.addCase(getAllBusinessTypes.rejected, (state, { payload }) => {
      state.loading = false
      state.businessTypeError = payload?.message
    })

    builder.addCase(getAllAccountTypes.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.accountTypes = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllAccountTypes.pending, (state, { payload }) => {
      state.loading = true
      state.accountTypeError = null
    })
    builder.addCase(getAllAccountTypes.rejected, (state, { payload }) => {
      state.loading = false
      state.accountTypeError = payload?.message
    })

    builder.addCase(getAllPaymentReasons.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.paymentReasons = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllPaymentReasons.pending, (state, { payload }) => {
      state.loading = true
      state.paymentReasonError = null
    })
    builder.addCase(getAllPaymentReasons.rejected, (state, { payload }) => {
      state.loading = false
      state.paymentReasonError = payload?.message
    })

    builder.addCase(getAllIndustryTypes.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.industryTypes = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllIndustryTypes.pending, (state, { payload }) => {
      state.loading = true
      state.industryTypesError = null
    })
    builder.addCase(getAllIndustryTypes.rejected, (state, { payload }) => {
      state.loading = false
      state.industryTypesError = payload?.message
    })

    builder.addCase(getAllProductTypes.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.productTypes = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllProductTypes.pending, (state, { payload }) => {
      state.loading = true
      state.productTypesError = null
    })
    builder.addCase(getAllProductTypes.rejected, (state, { payload }) => {
      state.loading = false
      state.productTypesError = payload?.message
    })

    builder.addCase(getAllDesignations.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.designations = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllDesignations.pending, (state, { payload }) => {
      state.loading = true
      state.designationsError = null
    })
    builder.addCase(getAllDesignations.rejected, (state, { payload }) => {
      state.loading = false
      state.designationsError = payload?.message
    })

    builder.addCase(getAllNationalities.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.nationalities = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllNationalities.pending, (state, { payload }) => {
      state.loading = true
      state.nationalitiesError = null
    })
    builder.addCase(getAllNationalities.rejected, (state, { payload }) => {
      state.loading = false
      state.nationalitiesError = payload?.message
    })

    builder.addCase(getAllMakePaymentPaidType.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.makePaymentPaidType = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllMakePaymentPaidType.pending, (state, { payload }) => {
      state.loading = true
      state.makePaymentPaidTypeError = null
    })
    builder.addCase(getAllMakePaymentPaidType.rejected, (state, { payload }) => {
      state.loading = false
      state.makePaymentPaidTypeError = payload?.message
    })

    builder.addCase(getAllMonthlyRevenueType.fulfilled, (state, { payload }) => {
      const { categories } = payload
      state.monthlyRevenueType = categories?.categories
      state.loading = false
    })
    builder.addCase(getAllMonthlyRevenueType.pending, (state, { payload }) => {
      state.loading = true
      state.monthlyRevenueTypeError = null
    })
    builder.addCase(getAllMonthlyRevenueType.rejected, (state, { payload }) => {
      state.loading = false
      state.monthlyRevenueTypeError = payload?.message
    })

    builder.addCase(getAllBanks.fulfilled, (state, { payload }) => {
      const { bank_response } = payload
      state.banks = bank_response?.banks
      state.loading = false
    })
    builder.addCase(getAllBanks.pending, (state, { payload }) => {
      state.loading = true
      state.banksError = null
    })
    builder.addCase(getAllBanks.rejected, (state, { payload }) => {
      state.loading = false
      state.banksError = payload?.message
    })

    builder.addCase(getBankBranch.pending, (state, { payload }) => {
      state.loading = true
      state.branchError = null
    })

    builder.addCase(getBankBranch.fulfilled, (state, { payload }) => {
      const { bank_response } = payload
      state.branch = bank_response?.banks
      state.loading = false
    })

    builder.addCase(getBankBranch.rejected, (state, { payload }) => {
      state.loading = false
      state.branchError = payload?.message
    })
    builder.addCase(getGeoInfo.fulfilled, (state, { payload }) => {
      state.loading = false
      state.localCountry = payload?.country
      state.localPhoneCode = payload?.country_calling_code
    })
    builder.addCase(getGeoInfo.pending, (state, { payload }) => {
      state.loading = true
      state.geoInfoError = null
    })
    builder.addCase(getGeoInfo.rejected, (state, { payload }) => {
      state.loading = false
      state.geoInfoError = payload?.message
    })

    builder.addCase(getLandingPage.pending, (state, { payload }) => {
      state.loading = true
    })

    builder.addCase(getLandingPage.fulfilled, (state, { payload }) => {
      state.loading = false
      state.redirectionPage = payload?.user?.landing_page?.landing_page
    })

    builder.addCase(getLandingPage.rejected, (state, { payload }) => {
      state.loading = false
    })
    builder.addCase(getAllAddress.fulfilled, (state, { payload }) => {
      if(payload?.status === 'SUCCESS'){
        if(payload?.address_response?.address !== undefined){
          state.businessAddressHtml = payload?.address_response?.address
          state.businessAddressLoading = false
          state.businessAddressStatus = payload?.status
        }
      }else {
        state.businessAddressLoading = true
      }
    })
    builder.addCase(getAllAddress.pending, (state, { payload }) => {
      state.businessAddressLoading = true
      state.businessAddressStatus = payload?.status

    })
    builder.addCase(getAllAddress.rejected, (state, { payload }) => {
      state.businessAddressLoading = true;
      state.businessAddressStatus = payload?.status
    })
  }
})

export const { resetCategoryState, updatePreviousPage, updateNextPage } = categorySlice.actions

export default categorySlice.reducer
