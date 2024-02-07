import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import TransactionService from 'src/services/TransactionService'

const initialState = {
  txList: [],
  message: null,
  loading: false,
  error: null
}

export const getTransactionList = createAsyncThunk('appTransaction/fetchTxList', async (data, thunkApi) => {
  try {
    const response = await TransactionService.getTx(data)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTransactionList.pending, (state, { payload }) => {
      state.loading = true
    })

    builder.addCase(getTransactionList.fulfilled, (state, { payload }) => {
      state.loading = false
      state.txList = payload?.transaction_request_response?.transaction_requests
    })

    builder.addCase(getTransactionList.rejected, (state, { payload }) => {
      state.loading = false
    })
  }
})

export default transactionSlice.reducer
