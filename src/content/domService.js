export function getArticleTitle() {
    const el = document.getElementsByClassName("mw-page-title-main")[0];
    return el ? el.textContent.trim() : "UNDEFINED";
}

export function getReferences() {
    const collection = document.getElementsByClassName("reference");
    const referenceArray = [[]];
    let j = 0;

    for (let i = 0; i < collection.length; i++) {
        referenceArray[j].push(collection[i]);
        if (!collection[i].nextSibling || collection[i].nextSibling.nodeName !== "SUP") {
            j++;
            referenceArray[j] = [];
        }
    }
    return referenceArray;
}

export function colorizeCitation(element, bias) {
    let color = { left: "#ca9ffc", center: "#ffde72", right: "#fc8a9b" }[bias] || "#fff";
    for (let prev = element.previousSibling; prev && prev.nodeName !== "SUP"; prev = prev.previousSibling) {
        if (prev.nodeName === "#text") {
            const span = document.createElement("span");
            span.style.backgroundColor = color;
            span.textContent = prev.textContent;
            prev.parentNode.replaceChild(span, prev);
        } else {
            prev.style.backgroundColor = color;
        }
    }
}
