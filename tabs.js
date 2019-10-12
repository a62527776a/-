const url = 'https://ytb.dscsdoj.top/'
// const url = 'http://localhost:8081/'

const tabsFn = {
  handleParsePages: async () => {
    let queryTabId = await tabsFn.queryMyPageTabId()
    if (queryTabId) {
      messageFn.sendParseUrlMessage(queryTabId)
    } else {
      chrome.tabs.create({
        url,
        active: false
      }, (tab) => {
        setTimeout(() => {
          messageFn.sendParseUrlMessage(tab.id)
        }, 2000)
      })
    }
  },
  queryMyPageTabId: async () => {
    let tabs = await tabsFn.queryMyPageTab()
    if (Array.isArray(tabs) && tabs.length > 0) {
      return tabs[0].id
    } else {
      return null
    }
  },
  queryMyPageTab: () => {
    return new Promise(async (resolve) => {
      chrome.tabs.query({
        url: url + '*'
      }, (res) => {
        resolve(res)
      })
    })
  },
  activeMyTab: async () => {
    let tabId = await tabsFn.queryMyPageTabId()
    chrome.tabs.update(tabId, {
      active: true
    })
  },
  getCurrentTab: () => {
    return new Promise(resolve => {
      chrome.tabs.getSelected(null, tab => resolve(tab));
    })
  }
}