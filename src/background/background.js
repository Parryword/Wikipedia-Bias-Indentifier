import browserAPI from "../shared/browserAPI";

const state = {
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

    console.log(`Received message: ${request.greeting || 'No greeting'}`);

    // Notify other listeners (e.g., popup)
    browserAPI.runtime.sendMessage({ message: "Hello popup" });

    if (sendResponse) {
        sendResponse({ response: "Response from background script" });
    }

    // Needed for async response in Chrome
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
        browserAPI.tabs.sendMessage(activeInfo.tabId, { action: "activate" });
    }
}

browserAPI.tabs.onActivated.addListener(handleTabActivated);
browserAPI.runtime.onMessage.addListener(handleMessage);

// --- Export for other modules if needed (optional) ---
export { getData, state };
