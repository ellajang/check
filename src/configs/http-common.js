import axios from 'axios'
import https from 'https'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export default axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
  //httpsAgent: httpsAgent
})
