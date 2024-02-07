export default {
  //meEndpoint: "/auth/me",
  meEndpoint: '/auth',
  loginEndpoint: '/auth',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  selectedLanguage: 'lang',
  userData: 'userData'
  //selectedLanguage: 'i18nextLng'
}
