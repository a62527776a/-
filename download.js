const downloadPath = 'qingtingvideo'

const downloadFn = {
  getDownloadSearch: cb => {
    chrome.downloads.search({query: [downloadPath]}, (res) => {
      cb(res)
    })
  },
  openDownloadItem: downloadId => {
    chrome.downloads.open(downloadId)
  },
  downloadVideo: (body, cb) => {
    chrome.downloads.download({
      url: body.message,
      filename: downloadPath + '/' + body.title + '.' + body.ext
    }, (res) => {
      if (!res) cb(body.message)
    })
  }
}
