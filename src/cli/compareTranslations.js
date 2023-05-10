import parseTranslationList from "../translations/parseTranslation.js";
import ComparisonBuilder from "../translations/subModules/comparison/ComparisonBuilder.js";

export default function compareTranslations(rawText, dictionary) {
  const translations = parseTranslationList(rawText, dictionary);
  const comparer = new ComparisonBuilder(translations);
  comparer.buildComparison();
  const formCommonalities = comparer.commonFormChunks;
  const wordCommonalities = comparer.commonWordChunks;

  // Log each
  console.log("\n\n");
  for (let [form, commonality] of formCommonalities) {
    console.log(commonality.toString())
  };

  console.log("\n\nWORDS:\n\n");
  for (let [word, commonality] of wordCommonalities) {
    if (commonality.translationCount > 1) {
      console.log(commonality.toString());
      console.log("common translations: " + commonality.translationCount);
    }
  };
}
