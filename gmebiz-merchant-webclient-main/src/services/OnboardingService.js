import http from 'src/configs/http-common'

const createMerchantOnboarding = data => {
  return http.post('/merchants/kyc', data)
}

const getMerchantPersonalDetails = data => {
  return http.post('/merchants/users', data)
}

const createMerchantPersonalDetails = data => {
  return http.post('/merchants/users', data)
}

const getMerchants = data => {
  return http.post('/merchants/kyc', data)
}

const getOnboardingStatus = data => {
  return http.post('/admin/merchants/kyc', data)
}

const getMerchantBanks = data => {
  return http.post('/merchants/banks', data)
}

const createMerchantBanks = data => {
  return http.post('/merchants/banks', data)
}

const getRepresentatives = data => {
  return http.post('/merchants/representatives', data)
}

const createRepresentatives = data => {
  return http.post('/merchants/representatives', data)
}

const getStockholders = data => {
  return http.post('/merchants/stockholders', data)
}

const createStockholders = data => {
  return http.post('/merchants/stockholders', data)
}

const getDirectors = data => {
  return http.post('/merchants/directors', data)
}

const createDirectors = data => {
  return http.post('/merchants/directors', data)
}

const createDocuments = data => {
  return http.post('/merchants/documents', data)
}

const getDocuments = data => {
  return http.post('/merchants/documents', data)
}

const OnboardingService = {
  createMerchantOnboarding,
  getOnboardingStatus,
  getMerchantPersonalDetails,
  createMerchantPersonalDetails,
  getMerchants,
  getMerchantBanks,
  createMerchantBanks,
  getRepresentatives,
  createRepresentatives,
  getStockholders,
  createStockholders,
  getDirectors,
  createDirectors,
  createDocuments,
  getDocuments
}

export default OnboardingService
