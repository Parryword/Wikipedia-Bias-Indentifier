_title = "UNDEFINED", _left = -1, _center = -1, _right = -1;

function handleMessage(request, sender, sendResponse) {
    console.log(`A content script sent a message: ${request.greeting}`);
    _left = request.data.left;
    _center = request.data.center;
    _right = request.data.right;
    _title = request.data.title;

    browser.runtime.sendMessage({
        message: "Hello popup"
    });
    sendResponse({ response: "Response from background script" });

}

browser.runtime.onMessage.addListener(handleMessage);

function getData() {
    return { "title": _title, "left": _left.toString(), "center": _center.toString(), "right": _right.toString() };
}