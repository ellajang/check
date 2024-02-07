import http from 'src/configs/http-common'

const getTx = data => {
  return http.post('/admin/transaction_request', data)
}

const getTxByTransaction = data => {
  return http.post('/transaction/transaction_request', data)
}

const TransactionService = {
  getTx,
  getTxByTransaction
}

export default TransactionService
