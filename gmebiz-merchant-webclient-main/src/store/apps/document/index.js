import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import DocumentServices from "../../../services/DocumentServices";

const initialState = {
  loading:false,
  error: null,
  message:null,
  status: '',
  viewFile: '',
  transactionRequestDocuments: []
}

export const downloadDocuments = createAsyncThunk('appDocuments/downloadDocuments', async (data, thunkApi) => {
  try {
    const response = await DocumentServices.downloadDocuments(data);

    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllDocuments = createAsyncThunk('appGetDocuments/getAllDocuments', async (data,thunkApi) =>{
  try {
    const response= await DocumentServices.getDocuments(data);

    return response.data;
  }catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const getAllTransactionRequestDocuments = createAsyncThunk('appGetDocuments/getTransRqDocuments', async (data,thunkApi) =>{
  try {
    const postData = {
      "function": "LIST",
      "scope": "ALL",
      "data": {
        "document": data
      }
    }
    const response= await DocumentServices.getDocuments(postData);

    return response.data;
  }catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const viewDocuments = createAsyncThunk('appGetDocuments/getAllDocuments', async (data,thunkApi) =>{
  try {
    const response= await DocumentServices.viewDocuments(data);

    return response.data;
  }catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

const documentSlices = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    resetViewFile: (state) =>{
      state.viewFile = ''
    }
  },
  extraReducers: (builder)=>{
    builder.addCase(viewDocuments.fulfilled, (state, {payload})=>{
      state.viewFile = payload?.documents?.file;
    })
    builder.addCase(getAllTransactionRequestDocuments.fulfilled, (state, {payload})=>{
      state.transactionRequestDocuments = payload?.documents?.documents;
    })
  }
})

export const {
  resetViewFile
} = documentSlices.actions;

export default documentSlices.reducer;
