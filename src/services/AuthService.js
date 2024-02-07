import http from 'src/configs/http-common'

const create = data => {
  return http.post('/auth', data)
}

const logout = data => {
  return http.post('/auth', data)
}

const forgot = data => {
  return http.post('/admin/password', data)
}

const AuthService = {
  create,
  forgot,
  logout
}

export default AuthService
