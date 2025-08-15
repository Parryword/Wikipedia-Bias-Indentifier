(() => {
  // src/shared/browserAPI.js
  var browserAPI = typeof browser !== "undefined" ? browser : chrome;
  var browserAPI_default = browserAPI;

  // src/background/background.js
  var state = {
    title: "UNDEFINED",
    left: -1,
    centerLeft: -1,
    center: -1,
    centerRight: -1,
    right: -1
  };
  function handleMessage(request, sender, sendResponse) {
    if (request.data) {
      const { title, left, centerLeft, center, centerRight, right } = request.data;
      Object.assign(state, { title, left, centerLeft, center, centerRight, right });
    }
    console.log(`Received message: ${request.greeting || "No greeting"}`);
    browserAPI_default.runtime.sendMessage({ message: "Hello popup" });
    if (sendResponse) {
      sendResponse({ response: "Response from background script" });
    }
    return true;
  }
  function getData() {
    return {
      title: state.title,
      left: String(state.left),
      centerLeft: String(state.centerLeft),
      center: String(state.center),
      centerRight: String(state.centerRight),
      right: String(state.right)
    };
  }
  function handleTabActivated(activeInfo) {
    if (activeInfo.tabId != null) {
      browserAPI_default.tabs.sendMessage(activeInfo.tabId, { action: "activate" });
    }
  }
  browserAPI_default.tabs.onActivated.addListener(handleTabActivated);
  browserAPI_default.runtime.onMessage.addListener(handleMessage);
})();
//# sourceMappingURL=background.js.map
