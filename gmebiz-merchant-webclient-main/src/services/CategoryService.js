import http from 'src/configs/http-common'

const getAll = data => {
  return http.post('/common/categories', data)
}

const getAddress = data => {
  return http.post('/common/address', data)
}

// const getGeoInfo = () => {
//   return http.get('https://ipapi.co/json/')
// }

const getBanks = data => {
  return http.post('/admin/bank', data)
}

const getBranch = data => {
  return http.post('/admin/bank/branch', data)
}

const getGeoInfo = () => {
  return fetch('https://ipapi.co/json/')
}

const getLanding = data => {
  return http.post('/admin/users', data)
}

const getIncCountries = data => {
  return http.post('/common/countries', data)
}

const CategoryService = {
  getAll,
  getGeoInfo,
  getBanks,
  getBranch,
  getLanding,
  getIncCountries,
  getAddress
}

export default CategoryService
