import browserAPI from "../shared/browserAPI.js";

export function sendState(title, counts) {
    return browserAPI.runtime.sendMessage({
        greeting: "Content Script",
        data: { title, left: counts.left, center: counts.center, right: counts.right }
    });
}

export function onMessage(callback) {
    browserAPI.runtime.onMessage.addListener(callback);
}
