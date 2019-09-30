const notificationsId = '蜻蜓视频解析'

const notificationsFn = {
  createNotifications: (message) => {
    chrome.notifications.clear(notificationsId)
    chrome.notifications.create(notificationsId, {
      type: 'basic',
      iconUrl: 'logo.png',
      title: notificationsId,
      message: message
    })
  }
}