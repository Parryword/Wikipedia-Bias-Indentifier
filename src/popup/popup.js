import browserAPI from '../shared/browserAPI.js';

let backgroundPage = browserAPI.extension.getBackgroundPage();

function updateUI() {
    const data = backgroundPage.getData();
    document.getElementById("left").innerText = data['left'];
    document.getElementById("center-left").innerText = data['center left'];
    document.getElementById("center").innerText = data['center'];
    document.getElementById("center-right").innerText = data['center right'];
    document.getElementById("right").innerText = data['right'];
    document.getElementById("title").innerText = data['title'];
}

document.addEventListener('DOMContentLoaded', updateUI);



