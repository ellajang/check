import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import ProfileDataService from 'src/services/ProfileService'

export const getCurrentUserProfile = createAsyncThunk('appPayment/fetchUserProfile', async (data, thunkApi) => {
  try {
    const response = await ProfileDataService.getUserProfile(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const updateUserProfile = createAsyncThunk('appPayment/updateUserProfile', async (data, thunkApi) => {
  try {
    const response = await ProfileDataService.updateProfile(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getMerchantKYC = createAsyncThunk('appProfile/GetMerchantKYC', async (data, thunkApi) => {
  try {
    const postData= {
      function: 'SEARCH',
      scope: 'SINGLE',
      data:{
        query_params: data
      }
    }
    const response = await ProfileDataService.getBusinessProfile(postData)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    userProfile: null,
    password: null,
    loading: false,
    profileError: null,
    updateError: null,
    fetchStatus: null,
    updateStatus: null,
    updateMessage: null,
    merchantProfile: null
  },
  reducers: {
    resetProfileToast: state => {
      state.updateStatus = null
      state.updateMessage = null
    }
  },
  extraReducers: builder => {
    builder.addCase(getCurrentUserProfile.pending, state => {
      state.loading = true
      state.userProfile = null
    })

    builder.addCase(getCurrentUserProfile.fulfilled, (state, { payload }) => {
      state.userProfile = payload?.user?.user
      state.fetchStatus = payload?.status
      state.loading = false
    })

    builder.addCase(getCurrentUserProfile.rejected, (state, { payload }) => {
      state.loading = false
      state.profileError = payload?.message
    })

    builder.addCase(updateUserProfile.pending, state => {
      state.loading = true
      state.updateMessage = null
      state.updateStatus = null
    })

    builder.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.updateMessage = payload?.message
      state.updateStatus = payload?.status
      state.loading = false
    })

    builder.addCase(updateUserProfile.rejected, (state, { payload }) => {
      state.loading = false
      state.updateError = payload?.message
    })
    builder.addCase(getMerchantKYC.fulfilled, (state, { payload }) => {
      state.loading = false
      state.merchantProfile = payload?.merchant?.merchants[0]
    })
    builder.addCase(getMerchantKYC.pending, (state, { payload }) => {
      state.loading = true
      state.businessName = null
      state.merchantProfile = {}
    })
    builder.addCase(getMerchantKYC.rejected, (state, { payload }) => {
      state.loading = true
      state.businessName = null
      state.merchantProfile = {}

    })
  }
})

export const { resetProfileToast } = profileSlice.actions

export default profileSlice.reducer
