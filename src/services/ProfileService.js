import http from 'src/configs/http-common'

const getUserProfile = data => {
  return http.post('/admin/profile', data)
}

const updateProfile = data => {
  return http.post('/admin/profile', data)
}

const getBusinessProfile = data => {
  return http.post('/merchants/kyc', data)
}

const ProfileService = {
  getUserProfile,
  getBusinessProfile,
  updateProfile
}

export default ProfileService
