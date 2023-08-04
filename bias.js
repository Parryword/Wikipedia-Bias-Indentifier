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
        bias: "center",
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
    "Politico": {
        url: "politico.com",
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
}

// Get all the citations
console.log("Getting list of references...");
const collection = document.getElementsByClassName("reference");
console.log(collection);

const reference_array = new Array();
function group_references() {
    var j = 0;
    reference_array[j] = new Array();
    for (let i = 0; i < collection.length; i++) {

        var prompt = i + " " + collection[i].childNodes[0].getAttribute("href") + " " + collection[i].nodeName;

        reference_array[j].push(collection[i]);
        
        if (collection[i].nextSibling !== null) {
            prompt = prompt + ", next: " + collection[i].nextSibling.nodeName;
        } else {
            prompt = prompt + " null";
        }

        if (collection[i].nextSibling == null || collection[i].nextSibling.nodeName !== "SUP") {
            j++;
            reference_array[j] = new Array();
        }

        console.log(prompt);

    }

    console.log("Reference array", reference_array);
}

group_references();
// Check every source
for (let i = 0; i < reference_array.length ; i++) {
    try {
        evaluate_group(i);
    } catch (err) {
        console.log("Error occured for citation group " + i);
        console.log(err);
    }
}

function evaluate_group(index) {
    let bias_score = null;

    const reference_list = reference_array[index];
    const first_reference = reference_list[0];

    for (let i = 0; i < reference_list.length; i++) {
        var current_reference = reference_list[i];
        var href = current_reference.childNodes[0].getAttribute("href");
        href = href.slice(1);

        let type = getCitationType(href);

        // Complete citation case (Work in progress)
        if (type === true) {
            // Complete citation
            // Construct ref id
            var ref_id = truncateString(href);
            console.log("Ref ID:", ref_id);
            // Get the reference by id
            var ref = document.getElementById(ref_id);
            console.log(ref);
            console.log(ref.innerHTML);

        }
        // Standard citation case
        else if (type === false) {
            console.log("Ref ID:", ref_id);
            var ref = document.getElementById(href).childNodes[2];
            console.log(ref);
            var innerHTML = ref.innerHTML;
            console.log("Source inner HTML:", innerHTML);

            for (const source in sources) {
                // console.log(source, sources[source].url);
                if (innerHTML.indexOf(sources[source].url) !== -1) {
                    // console.log("Source found!");
                    // console.log("Checking bias...");
                    // console.log(sources[source].bias);
                    let bias = sources[source].bias;
                    if (bias === "center" && bias_score == null) {
                        bias_score = 0;
                    }
                    if (bias === "left") {
                        bias_score--;
                    } 
                    if (bias === "right") {
                        bias_score++;
                    }
                    break;

                } else {
                    // console.log("Source not found!");
                }
            }
        }
    }

    if (bias_score == null) {
        return;
    }
    if (bias_score < 0)
        colorize(first_reference, "left");
    if (bias_score == 0) 
        colorize(first_reference, "center");
    if (bias_score > 0)
        colorize(first_reference, "right");
}

/**
 * Colorizes the nodes backwards starting from the current citation to previous citation.
 * @param {any} element
 * @param {any} bias
 */
function colorize(element, bias) {
    var color = "";
    if (bias === "left") {
        color = "#ca9ffc";
    }
    if (bias === "center") {
        color = "#ffde72";
    }
    if (bias === "right") {
        color = "#fc8a9b";
    }
    console.log(element.previousSibling);
    for (let prev = element.previousSibling; prev.nodeName !== "SUP"; prev = prev.previousSibling) {
        if (prev.nodeName === '#text') {
            temp = document.createElement("span");
            temp.setAttribute("style", "background-color:" + color);
            textNode = document.createTextNode(prev.textContent);
            temp.appendChild(textNode);
            prev.parentNode.replaceChild(temp, prev);
            prev = temp;
        } else {
            console.log(prev.nodeName);
            prev.setAttribute("style", "background-color:" + color);
        }

    }
}
/**
 * This function checks the type of the citation. 
 * In Wikipedia, there are two citation types: 
 * 1) A direct citation ("standard citation"),
 * 2) An indirect citation to the reference ("complete citation").
 * @param {any} str
 */
function getCitationType(str) {
    let pattern = /FOOTNOTE/;
    let index = str.search(pattern);
    if (index === -1) {
        console.log("Citation does not contain FOOTNOTE token. The system will check the standard citation.");
        return false;
    } else {
        console.log("Citation contains the FOOTNOTE token. The system will check the complete citation.");
        return true;
    }
}

/**
 * This method truncates a string until the end of the first 4 digit number.
 * @param {any} str
 */
function truncateString(str) {
    // create a regex pattern that matches four consecutive digits
    let pattern = /\d{4}/;
    // find the index of the first match in the string
    let index = str.search(pattern);
    // if there is no match, return the original string
    if (index === -1) {
        return str;
    }
    // otherwise, return the substring from the start to the index
    else {
        return "CITEREF" + str.slice(18, index + 4);
    }
}

function contains_word(str) {
    let pattern = /The New York Times/;
    let index = str.search(pattern);
    if (index === -1) {
        console.log("false");
        return false;
    } else {
        console.log("true");
        return true;
    }
}
