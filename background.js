// var url = 'https://ytb.dscsdoj.top/'
var url = 'http://localhost:8082/'
const notificationsId = '蜻蜓视频解析'
const downloadPath = 'qingtingvideo'

var handleParsePages = async function (active) {
  let queryTabId = await queryPageTabId()
  if (queryTabId) {
    sendParseUrlMessage(queryTabId)
  } else {
    chrome.tabs.create({
      url,
      active: false
    }, (tab) => {
      setTimeout(() => {
        sendParseUrlMessage(tab.id)
      }, 2000)
    })
  }
}

let queryPageTabId = async function () {
  let tabs = await queryPageTab()
  if (Array.isArray(tabs) && tabs.length > 0) {
    return tabs[0].id
  } else {
    return null
  }
}

var queryPageTab = function () {
  return new Promise(async (resolve) => {
    chrome.tabs.query({
      url: url + '*'
    }, (res) => {
      resolve(res)
    })
  })
}

let getCurrentTab = () => {
  return new Promise(resolve => {
    chrome.tabs.getSelected(null, tab => resolve(tab));
  })
}

let sendParseUrlMessage = async (tabId) => {
  let currentTab = await getCurrentTab()
  sendMessageToTab(tabId, {
    actions: 'parseUrl',
    url: encodeURIComponent(currentTab.url)
  })
}

let sendDownloadFailMessage = async (message) => {
  let tabId = await queryPageTabId()
  if (!tabId) return
  sendMessageToTab(tabId, {
    actions: 'chrome.downloads.download.fail',
    message
  })
}

let sendDownloadDataMessage = async (data) => {
  let tabId = await queryPageTabId()
  if (!tabId) return
  sendMessageToTab(tabId, {
    actions: 'chrome.downloads.search.data',
    data
  })
}

let sendMessageToTab = async (TabId, message) => {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(TabId, message, res => {
      resolve(res)
    })
  })
}

chrome.runtime.onInstalled.addListener(function() {
  console.log("蜻蜓视频解析欢迎您 - " + url);
});

chrome.contextMenus.create({
  id: 'iggcdnibfnjahamihceeihmbipmpojcc',
  title: '解析该网页 - 蜻蜓视频解析'
})

chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId == "iggcdnibfnjahamihceeihmbipmpojcc") {
    handleParsePages()
  }
})

let createNotifications = (message) => {
  chrome.notifications.clear(notificationsId)
  chrome.notifications.create(notificationsId, {
    type: 'basic',
    iconUrl: 'logo.png',
    title: '蜻蜓视频解析',
    message: message
  })
}

chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId === notificationsId) {
    let tabId = await queryPageTabId()
    chrome.tabs.update(tabId, {
      active: true
    })
  }
})

chrome.runtime.onMessage.addListener((request, sender) => {
  if (!sender.tab) return
  if (request.actions === 'notice') {
    createNotifications(request.message)
  }
  if (request.actions === 'chrome.downloads.search.get') {
    return getDownloadSearch()
  }
  if (request.actions === 'chrome.downloads.download') {
    return downloadVideo(request)
  }
  if (request.actions === 'chrome.downloads.download.open') {
    return openDownloadItem(request.message)
  }
})

let downloadVideo = (body) => {
  chrome.downloads.download({
    url: body.message,
    filename: downloadPath + '/' + body.title + '.' + body.ext
  }, (res) => {
    if (!res) sendDownloadFailMessage(url)
  })
}

let openDownloadItem = downloadId => {
  chrome.downloads.open(downloadId)
}

let getDownloadSearch = () => {
  chrome.downloads.search({query: [downloadPath]}, (res) => {
    sendDownloadDataMessage(res)
  })
}