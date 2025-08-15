import { sources } from "./sources.js";
import { colorizeCitation } from "./domService.js";

export class BiasEvaluator {
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

        referenceList.forEach(ref => {
            const href = ref.childNodes[0].getAttribute("href").slice(1);
            let isBasicCitation = !(/FOOTNOTE/.test(href));

            // Only standard citations for now
            if (isBasicCitation) {
                const innerHTML = document.getElementById(href)?.childNodes[2]?.innerHTML || "";
                for (const sourceName in sources) {
                    const source = sources[sourceName];
                    if (innerHTML.includes(source.url)) {
                        const bias = source.bias;
                        if (bias === "center" && biasScore == null) {
                            biasScore = 0; this.countCenter++;
                        }
                        if (bias === "left") { biasScore--; this.countLeft++; }
                        if (bias === "right") { biasScore++; this.countRight++; }
                        break;
                    }
                }
            }
            else {
                // Handle complete citations if needed
                console.warn("Complete citation handling is not implemented yet.");
            }

            
        });

        if (biasScore !== null) {
            const bias = biasScore < 0 ? "left" : biasScore > 0 ? "right" : "center";
            colorizeCitation(firstRef, bias);
        }
    }
}
