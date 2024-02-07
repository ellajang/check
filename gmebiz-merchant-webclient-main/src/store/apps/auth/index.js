import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from 'src/services/AuthService'

// ** Add User
export const createUser = createAsyncThunk('appAuth/createUser', async (data, { getState, dispatch }) => {
  const response = await axios.post('/apps/users/add-user', {
    data
  })

  //dispatch(fetchData(getState().user.params))

  return response.data
})

export const createAuth = createAsyncThunk('appAuth/createAuth', async (data, thunkApi) => {
  try {
    const response = await AuthService.create(data)

    return response
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const logout = createAsyncThunk('appAuth/logout', async (data, thunkApi) => {
  try {
    const response = await AuthService.logout(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const resetPassword = createAsyncThunk('appAuth/resetPassword', async (data, thunkApi) => {
  try {
    const response = await AuthService.forgot(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const changePassword = createAsyncThunk('appAuth/changePassword', async (data, thunkApi) => {
  try {
    const response = await AuthService.forgot(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const appAuthSlice = createSlice({
  name: 'appAuth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    msg: null,
    response: null,
    logoutResponseStatus: null,
    resetPasswordResponse: null,
    changePasswordResponse: null,
    changePasswordError: null,
    messageCode: null,
    loading: false,
    error: null
  },
  reducers: {
    resetPassResetResponse: (state, action) => {
      state.resetPasswordResponse = null
      state.msg = null
      state.messageCode = null
    },
    resetChangePasswordResponse: (state, action) => {
      state.changePasswordResponse = null
      state.msg = null
    },
    resetLogoutResponse: (state, action) => {
      state.logoutResponseStatus = null
      state.error = null
      state.msg = null
    }
  },

  extraReducers: builder => {
    builder
      .addCase(resetPassword.pending, (state, action) => {
        state.loading = true
        state.resetPasswordResponse = null
        state.msg = null
        state.messageCode = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.loading = false
        state.resetPasswordResponse = action.payload?.status
        state.msg = action.payload?.message
        state.messageCode = action.payload?.message_code
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
        state.resetPasswordResponse = null
        state.msg = action.payload?.message
        state.messageCode = action.payload?.message
      })

    builder
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        console.log('action', action)
        state.loading = false
        state.changePasswordResponse = action.payload?.status
        state.msg = action.payload?.message
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.changePasswordError = action.payload?.message
      })

    builder
      .addCase(logout.pending, (state, action) => {
        state.loading = true
        state.logoutResponseStatus = null
        state.msg = null
        state.error = null
      })
      .addCase(logout.fulfilled, (state, action) => {
        console.log('payload data', action.payload)
        state.loading = false
        state.logoutResponseStatus = action.payload?.status
        state.msg = action.payload?.message
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
        state.logoutResponseStatus = action.payload?.response?.status
        state.msg = action.payload?.message
      })
  }
})

export const { resetPassResetResponse, resetChangePasswordResponse, resetLogoutResponse } = appAuthSlice.actions

export default appAuthSlice.reducer
