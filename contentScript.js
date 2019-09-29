chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (sender.tab) return
  if (request.actions === 'parseUrl') {
    window.postMessage(request, '*')
  }
  if (request.actions === 'chrome.downloads.download.fail') {
    window.postMessage(request, '*')
  }
  if (request.actions === 'chrome.downloads.search.data') {
    window.postMessage(request, '*')
  }
})

window.addEventListener("message", async (event) => {
  if (event.data && event.data.actions === 'notice') {
    chrome.runtime.sendMessage(event.data)
  }
  if (event.data && event.data.actions === 'chrome.downloads.search.get') {
    chrome.runtime.sendMessage(event.data)
  }
  if (event.data && event.data.actions === 'chrome.downloads.download') {
    chrome.runtime.sendMessage(event.data)
  }
  if (event.data && event.data.actions === 'chrome.downloads.download.open') {
    chrome.runtime.sendMessage(event.data)
  }
})

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
injectScript( chrome.extension.getURL('/my.js'), 'body');