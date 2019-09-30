const messageFn = {
  sendParseUrlMessage: (tabId) => {
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
  sendDownloadDataMessage: data => {
    let tabId = await tabsFn.queryMyPageTabId()
    if (!tabId) return
    messageFn.sendMessageToMyTab({
      actions: 'chrome.downloads.search.data',
      data
    })
  },
  sendDownloadFailMessage: message => {
    let tabId = await tabsFn.queryMyPageTabId()
    if (!tabId) return
    sendMessageToTab(tabId, {
      actions: 'chrome.downloads.download.fail',
      message
    })
  }
}