const menuId = 'iggcdnibfnjahamihceeihmbipmpojcc'

const contextMenusFn = {
  init: () => {
    chrome.contextMenus.create({
      id: menuId,
      title: '解析该网页 - 蜻蜓视频解析'
    })
  }
}