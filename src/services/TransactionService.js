import http from 'src/configs/http-common'

const getTx = data => {
  return http.post('/admin/transaction_request', data)
}

const TransactionService = {
  getTx
}

export default TransactionService
