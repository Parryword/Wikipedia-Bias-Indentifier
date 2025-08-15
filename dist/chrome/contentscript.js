(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/content/sources.js
  var require_sources = __commonJS({
    "src/content/sources.js"() {
    }
  });

  // src/content/domService.js
  function getArticleTitle() {
    const el = document.getElementById("firstHeading").firstChild.textContent;
    ;
    return el ? el.textContent.trim() : "UNDEFINED";
  }
  function getReferences() {
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
  function colorizeCitation(element, bias) {
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

  // src/content/biasEvaluator.js
  var import_sources = __toESM(require_sources());
  var BiasEvaluator = class {
    constructor() {
      this.countLeft = 0;
      this.countCenterLeft = 0;
      this.countCenter = 0;
      this.countCenterRight = 0;
      this.countRight = 0;
    }
    evaluateReferences(referenceGroups) {
      referenceGroups.forEach((group, index) => {
        try {
          this.evaluateGroup(group);
        } catch (err) {
          console.error(`Error evaluating group ${index}:`, err);
        }
      });
      return { left: this.countLeft, center: this.countCenter, right: this.countRight };
    }
    evaluateGroup(referenceList) {
      let biasScore = null;
      const firstRef = referenceList[0];
      referenceList.forEach((ref) => {
        const href = ref.childNodes[0].getAttribute("href").slice(1);
        let isBasicCitation = !/FOOTNOTE/.test(href);
        if (isBasicCitation) {
          const innerHTML = document.getElementById(href)?.childNodes[2]?.innerHTML || "";
          for (const sourceName in import_sources.default) {
            const source = import_sources.default[sourceName];
            if (innerHTML.includes(source.url)) {
              const bias = source.bias;
              if (bias === "center" && biasScore == null) {
                biasScore = 0;
                this.countCenter++;
              }
              if (bias === "left") {
                biasScore--;
                this.countLeft++;
              }
              if (bias === "center left") {
                biasScore -= 0.5;
                this.countCenterLeft++;
              }
              if (bias === "center right") {
                biasScore += 0.5;
                this.countCenterRight++;
              }
              if (bias === "right") {
                biasScore++;
                this.countRight++;
              }
              break;
            }
          }
        } else {
          console.warn("Complete citation handling is not implemented yet.");
        }
      });
      if (biasScore !== null) {
        const bias = biasScore < 0 ? "left" : biasScore > 0 ? "right" : "center";
        colorizeCitation(firstRef, bias);
      }
    }
  };

  // src/shared/browserAPI.js
  var browserAPI = typeof browser !== "undefined" ? browser : chrome;
  var browserAPI_default = browserAPI;

  // src/content/messaging.js
  function sendState(title, counts2) {
    return browserAPI_default.runtime.sendMessage({
      greeting: "Content Script",
      data: { title, left: counts2.left, center: counts2.center, right: counts2.right }
    });
  }
  function onMessage(callback) {
    browserAPI_default.runtime.onMessage.addListener(callback);
  }

  // src/content/contentScript.js
  var articleTitle = getArticleTitle();
  var references = getReferences();
  var evaluator = new BiasEvaluator();
  var counts = evaluator.evaluateReferences(references);
  console.log(`Bias summary: Left=${counts.left}, Center=${counts.center}, Right=${counts.right}`);
  sendState(articleTitle, counts);
  onMessage(() => {
    sendState(articleTitle, counts);
  });
})();
//# sourceMappingURL=contentScript.js.map
