import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import NotificationServices from "../../../services/NotificationService";

const initialState = {
  loading: false,
  error: null,
  message: null,
  status: '',
  notifications: []

}

export const getAllNotifications = createAsyncThunk('appNotification/GetAllNotifications', async (data, thunkApi) => {
  try {
    const postData = {
      function: 'LIST',
      scope: 'ALL'
    }
    const response = await NotificationServices.getNotification(postData)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})



const notificationSlices = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // TODO: add some reducers here
  },
  extraReducers: builder => {
    builder.addCase(getAllNotifications.fulfilled, (state, { payload }) => {
      state.message = payload.message
      state.status = payload.status
      state.notifications = payload?.notification?.notifications
    })

  }
})

export const {} = notificationSlices.actions

export default notificationSlices.reducer
