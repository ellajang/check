import http from 'src/configs/http-common'

const getNotification = data => {
  return http.post('/admin/notification', data)
}


const NotificationServices = {
  getNotification
}

export default NotificationServices
