const menuId = 'iggcdnibfnjahamihceeihmbipmpojcc'

const contextMenusFn = {
  init: () => {
    chrome.contextMenus.create({
      id: menuId,
      title: '解析该网页 - 蜻蜓视频解析'
    })
    chrome.contextMenus.onClicked.addListener(info => {
      if (info.menuItemId == menuId) {
        tabsFn.handleParsePages()
      }
    })
  }
}