// src/redux/formSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import RegisterDataService from 'src/services/RegisterService'

const initialState = {
  userData: '',
  accountType: 'BUSINESS',
  countryOfIncorporation: null,
  email: '',
  phone: '',
  phoneCode: '',
  password: '',
  responseStatus: null,
  signupStatus: null,
  sourceId: null,
  signupKey: null,
  message: null,
  passwordStatus: null,
  loading: false,
  error: null
}

export const createEmail = createAsyncThunk('appRegister/createEmail', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.create(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createEmailOtp = createAsyncThunk('appRegister/createEmailOtp', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.createOtp(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const resendEmailOtp = createAsyncThunk('appRegister/resendEmailOtp', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.createOtp(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createPhone = createAsyncThunk('appRegister/createPhone', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.create(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createPhoneOtp = createAsyncThunk('appRegister/createPhoneOtp', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.createOtp(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const resendPhoneOtp = createAsyncThunk('appRegister/resendPhoneOtp', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.createOtp(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createPassword = createAsyncThunk('appRegister/createPassword', async (data, thunkApi) => {
  try {
    const response = await RegisterDataService.create(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    updateBusinessForm: (state, action) => {
      state.accountType = action.payload
    },
    updateCountryOfIncorporation: (state, action) => {
      state.countryOfIncorporation = action.payload
    },
    updateEmail: (state, action) => {
      state.email = action.payload
    },
    updatePhone: (state, action) => {
      state.phone = action.payload?.phone
      state.phoneCode = action.payload?.phoneCode
    },
    resetErrorState: state => {
      state.error = null
      state.message = null
      state.responseStatus = null
      state.signupStatus = null
    },
    resetRegisterState: state => {
      state.loading = false
      state.error = null
      state.responseStatus = null
      state.message = null
      state.sourceId = null
      state.passwordStatus = null
    }
  },
  extraReducers: builder => {
    builder.addCase(createEmail.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.user_signup?.user_signup_status
      state.sourceId = payload?.user_signup?.source_id
      state.signupKey = payload?.user_signup?.signup_key
    })

    builder.addCase(createEmail.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.error = null
    })

    builder.addCase(createEmail.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload?.message
      state.signupStatus = null
      state.responseStatus = null
    })

    builder.addCase(createEmailOtp.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.otp?.otp_status
      state.message = payload?.message
    })

    builder.addCase(createEmailOtp.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.signupStatus = null
      state.error = null
      state.message = null
    })

    builder.addCase(createEmailOtp.rejected, (state, { payload }) => {
      state.loading = false
      state.responseStatus = null
      state.signupStatus = null
      state.error = payload.message
      state.message = null
    })

    builder.addCase(resendEmailOtp.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.otp?.otp_status
      state.message = payload?.message
      state.signupKey = payload?.otp?.signup_key
    })

    builder.addCase(resendEmailOtp.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.signupStatus = null
      state.error = null
      state.message = null
      state.signupKey = null
    })

    builder.addCase(resendEmailOtp.rejected, (state, { payload }) => {
      state.loading = false
      state.responseStatus = null
      state.signupStatus = null
      state.error = payload.message
      state.message = null
      state.signupKey = null
    })

    builder.addCase(createPhone.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.phone?.phone_status
      state.message = payload?.message
    })

    builder.addCase(createPhone.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.signupStatus = null
      state.error = null
      state.message = null
    })

    builder.addCase(createPhone.rejected, (state, { payload }) => {
      state.loading = false
      state.responseStatus = null
      state.signupStatus = null
      state.error = payload?.message
      state.message = null
    })

    builder.addCase(createPhoneOtp.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.otp?.otp_status
      state.message = payload?.message
    })

    builder.addCase(createPhoneOtp.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.signupStatus = null
      state.error = null
      state.message = null
    })

    builder.addCase(createPhoneOtp.rejected, (state, { payload }) => {
      state.loading = false
      state.responseStatus = null
      state.signupStatus = null
      state.error = payload?.message
      state.message = null
    })

    builder.addCase(resendPhoneOtp.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.otp?.otp_status
      state.message = payload?.message
    })

    builder.addCase(resendPhoneOtp.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.signupStatus = null
      state.error = null
      state.message = null
    })

    builder.addCase(resendPhoneOtp.rejected, (state, { payload }) => {
      state.loading = false
      state.responseStatus = null
      state.signupStatus = null
      state.error = payload.message
      state.message = null
    })

    builder.addCase(createPassword.fulfilled, (state, { payload }) => {
      state.loading = false
      state.responseStatus = payload?.status
      state.signupStatus = payload?.user_signup_password?.password_status_code
      state.message = payload?.message
      state.userData = payload?.auth
    })

    builder.addCase(createPassword.pending, (state, { payload }) => {
      state.loading = true
      state.responseStatus = null
      state.signupStatus = null
      state.error = null
      state.message = null
    })

    builder.addCase(createPassword.rejected, (state, { payload }) => {
      state.loading = false
      state.responseStatus = null
      state.signupStatus = null
      state.error = payload?.message
      state.message = null
    })
  }
})

export const {
  resetRegisterState,
  updateBusinessForm,
  updateCountryOfIncorporation,
  updateEmail,
  updatePhone,
  resetErrorState
} = registerSlice.actions

export default registerSlice.reducer
