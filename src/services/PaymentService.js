import http from 'src/configs/http-common'

const getEx = data => {
  return http.post('/finance/outbound', data)
}

const getCurrencies = data => {
  return http.post('/finance/outbound', data)
}

// const getEx = data => {
//   return http.post('/transaction/exchange_rate', data)
// }

const getFee = data => {
  return http.post('/finance/outbound', data)
}

const getFxQ = data => {
  return http.post('/finance/outbound', data)
}

const getConfirmTx = data => {
  return http.post('/transaction/transaction_request', data)
}

const createVirtualAccount = data => {
  return http.post('/transaction/virtualAccount', data)
}

const PaymentService = {
  getEx,
  getCurrencies,
  getFee,
  getFxQ,
  getConfirmTx,
  createVirtualAccount
}

export default PaymentService
