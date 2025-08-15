(() => {
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

  // src/content/sources.js
  var sources = {
    "BBC": {
      url: "bbc.com",
      bias: "center"
    },
    "Reuters": {
      url: "reuters.com",
      bias: "center"
    },
    "Time": {
      url: "time.com",
      bias: "center"
    },
    "Public Broadcast Service": {
      url: "pbs.org",
      bias: "center"
    },
    "NBC News": {
      url: "nbcnews.com",
      bias: "center"
    },
    "CNBC News": {
      url: "cnbcnews.com",
      bias: "center"
    },
    "CNBC": {
      url: "cnbc.com",
      bias: "center"
    },
    "ABC News": {
      url: "abcnews.go.com",
      bias: "center"
    },
    "Foreign Policy": {
      url: "foreignpolicy.com",
      bias: "center"
    },
    "USA Today": {
      url: "usatoday.com",
      bias: "center"
    },
    "CBS News": {
      url: "cbsnews.com",
      bias: "center"
    },
    "The Hill": {
      url: "thehill.com",
      bias: "center"
    },
    "Financial Times": {
      url: "ft.com",
      bias: "center"
    },
    "Bussiness Insider": {
      url: "businessinsider.com",
      bias: "center"
    },
    "Bloomberg": {
      url: "bloomberg.com",
      bias: "center"
    },
    "Los Angeles Times": {
      url: "latimes.com",
      bias: "center"
    },
    "Wired": {
      url: "wired.com",
      bias: "center"
    },
    "Associated Press": {
      url: "apnews.com",
      bias: "center"
    },
    "Vanity Fair": {
      url: "vanityfair.com",
      bias: "center"
    },
    "Forbes": {
      url: "forbes.com",
      bias: "center"
    },
    "The Conversation": {
      url: "theconversation.com",
      bias: "center"
    },
    "The Week": {
      url: "theweek.com",
      bias: "center"
    },
    "New York Times": {
      url: "nytimes.com",
      bias: "left"
    },
    "Washington Post": {
      url: "washingtonpost.com",
      bias: "left"
    },
    "CNN": {
      url: "cnn.com",
      bias: "left"
    },
    "The Guardian": {
      url: "theguardian.com",
      bias: "left"
    },
    "Politico": {
      url: "politico.com",
      bias: "left"
    },
    "Huffington Post": {
      url: "huffpost.com",
      bias: "left"
    },
    "Vox": {
      url: "vox.com",
      bias: "left"
    },
    "The Atlantic": {
      url: "theatlantic.com",
      bias: "left"
    },
    "The Independent": {
      url: "independent.co.uk",
      bias: "left"
    },
    "Slate": {
      url: "slate.com",
      bias: "left"
    },
    "The New Yorker": {
      url: "newyorker.com",
      bias: "left"
    },
    "Daily Beast": {
      url: "thedailybeast.com",
      bias: "left"
    },
    "National Public Radio": {
      url: "npr.org",
      bias: "left"
    },
    "New York Magazine": {
      url: "nymag.com",
      bias: "left"
    },
    "Vice News": {
      url: "vice.com",
      bias: "left"
    },
    "MSNBC": {
      url: "msnbc.com",
      bias: "left"
    },
    "BuzzFeed News": {
      url: "buzzfeednews.com",
      bias: "left"
    },
    "The Sun": {
      url: "thesun.co.uk",
      bias: "right"
    },
    "Fox News": {
      url: "foxnews.com",
      bias: "right"
    },
    "New York Post": {
      url: "nypost.com",
      bias: "right"
    },
    "Daily Wire": {
      url: "dailywire.com",
      bias: "right"
    },
    "Federalist": {
      url: "thefederalist.com",
      bias: "right"
    },
    "Reason": {
      url: "reason.com",
      bias: "right"
    },
    "Wall Street Journal": {
      url: "wsj.com",
      bias: "right"
    },
    "Washington Times": {
      url: "washingtontimes.com",
      bias: "right"
    },
    "National Review": {
      url: "nationalreview.com",
      bias: "right"
    }
  };
  var sources_default = sources;

  // src/content/biasEvaluator.js
  var BiasEvaluator = class {
    constructor() {
      this.countLeft = 0;
      this.countCenter = 0;
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
          for (const sourceName in sources_default) {
            const source = sources_default[sourceName];
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

  // src/content/contentscript.js
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
//# sourceMappingURL=contentscript.js.map
