import browserAPI from './shared/browserAPI.js';

const state = {
    title: "UNDEFINED",
    left: -1,
    center: -1,
    right: -1
};

function handleMessage(request, sender, sendResponse) {
    if (request.data) {
        const { title, left, center, right } = request.data;
        Object.assign(state, { title, left, center, right });
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
        center: String(state.center),
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
