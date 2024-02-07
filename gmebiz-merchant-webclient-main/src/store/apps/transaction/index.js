import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import TransactionService from 'src/services/TransactionService'

const initialState = {
  txList: [],
  singleTx: {},
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

export const getSingleTransactionRequest = createAsyncThunk('appTransaction/fetchSingleTxReq', async (data, thunkApi) => {
  try {
    const postData = {
      function: 'SEARCH',
      scope: 'SINGLE',
      data: {
        query_params: {
          by: 'TRANSACTION_REQUESTS_ID',
          value: data
        }
      }
    }
    const response = await TransactionService.getTxByTransaction(postData)

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    updateTransaction: (state, {payload}) => {
      state.txList = payload
    }
  },
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
    builder.addCase(getSingleTransactionRequest.pending, (state, { payload }) => {
      state.loading = true
    })
    builder.addCase(getSingleTransactionRequest.rejected, (state, { payload }) => {
      state.loading = false
    })
    builder.addCase(getSingleTransactionRequest.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.singleTx = payload?.transaction_request_details?.transaction_requests[0]
    })
  }
})

export const { updateTransaction } = transactionSlice.actions

export default transactionSlice.reducer
