import parseTranslationList from "../parseTranslation.js";
import ComparisonBuilder from "./ComparisonBuilder.js";

export default function compareTranslations(rawText, dictionary) {
  const translations = parseTranslationList(rawText, dictionary);
  const comparer = new ComparisonBuilder(translations);
  const formCommonalities = comparer.buildComparison();
  
  // Log each
  console.log("\n\n");
  for (let commonality of formCommonalities) {
    console.log(commonality.toString())
  };
}
