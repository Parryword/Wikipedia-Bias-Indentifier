import { getArticleTitle, getReferences } from "./domService.js";
import { BiasEvaluator } from "./biasEvaluator.js";
import { sendState, onMessage } from "./messaging.js";

const articleTitle = getArticleTitle();
const references = getReferences();

const evaluator = new BiasEvaluator();
const counts = evaluator.evaluateReferences(references);

console.log(`Bias summary: Left=${counts.left}, Center=${counts.center}, Right=${counts.right}`);

sendState(articleTitle, counts);

onMessage(() => {
    sendState(articleTitle, counts);
});
