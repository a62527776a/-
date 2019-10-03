const notificationsId = '蜻蜓视频解析'

const notificationsFn = {
  init: () => {
    chrome.notifications.onClicked.addListener(async (notificationId) => {
      if (notificationId === notificationsId) {
        tabsFn.activeMyTab()
      }
    })
  },
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