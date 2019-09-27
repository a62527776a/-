var url = 'https://ytb.dscsdoj.top/'

var handleParsePages = async function () {
  let queryTab = await queryPageTab()
  if (Array.isArray(queryTab) && queryTab.length > 0) {
    sendParseUrlMessage(queryTab[0].id)
  } else {
    chrome.tabs.create({
      url,
      active: false
    }, (tab) => {
      sendParseUrlMessage(tab.id)
    })
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

let sendParseUrlMessage = (tabId) => {
  let currentTab = await getCurrentTab()
  sendMessageToTab(tabId, {
    actions: 'parseUrl',
    url: encodeURIComponent(currentTab.url)
  })
}

let sendMessageToTab = (TabId, message) => {
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
