const messageFn = {
  init: () => {
    chrome.runtime.onMessage.addListener((request, sender) => {
      if (!sender.tab) return
      if (request.actions === 'notice') {
        return notificationsFn.createNotifications(request.message)
      }
      if (request.actions === 'chrome.downloads.search.get') {
        return downloadFn.getDownloadSearch(messageFn.sendDownloadDataMessage)
      }
      if (request.actions === 'chrome.downloads.download') {
        return downloadFn.downloadVideo(request, messageFn.sendDownloadFailMessage)
      }
      if (request.actions === 'chrome.downloads.download.open') {
        return downloadFn.openDownloadItem(request.message)
      }
    })    
  },
  sendParseUrlMessage: async (tabId) => {
    let currentTab = await tabsFn.getCurrentTab()
    messageFn.sendMessageToTab(tabId, {
      actions: 'parseUrl',
      url: encodeURIComponent(currentTab.url)
    })
  },
  sendMessageToTab: (tabId, message) => {
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tabId, message, res => {
        resolve(res)
      })
    })
  },
  sendMessageToMyTab: message => {
    return new Promise(async resolve => {
      let tabId = await tabsFn.queryMyPageTabId()
      let res = await messageFn.sendMessageToTab(tabId, message)
      resolve(res)
    })
  },
  sendDownloadDataMessage: async data => {
    let tabId = await tabsFn.queryMyPageTabId()
    if (!tabId) return
    messageFn.sendMessageToMyTab({
      actions: 'chrome.downloads.search.data',
      data
    })
  },
  sendDownloadFailMessage: async message => {
    let tabId = await tabsFn.queryMyPageTabId()
    if (!tabId) return
    messageFn.sendMessageToTab(tabId, {
      actions: 'chrome.downloads.download.fail',
      message
    })
  }
}