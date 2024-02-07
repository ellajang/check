import http from "src/configs/http-common"

const create = data => {
  return http.post("/signup", data)
}

const createOtp = data => {
  return http.post("/otp", data)
}

const RegisterService = {
  create,
  createOtp
}

export default RegisterService
