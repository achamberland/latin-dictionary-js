import Commonalities from "./models/Commonalities.js";
import ComparableChunk from "./models/ComparableChunk.js";


// Stores TranslationChunks in common between many Translations
export default class ComparisonBuilder {

  constructor(translations) {
    this.translations = translations;
    this.commonFormChunks = new Map();
    this.commonWordChunks = new Map();
  }

  // Todo: Just split it into individual methods
  buildComparison() {
    this.buildFormCommonalities();
    this.buildRootWordCommonalities();
  } 

  buildFormCommonalities() {
    let unsortedFormChunks = {};
    for (let translation of this.translations) {
      if (!translation.chunks?.length) {
        console.error("No chunks for translation?")
      }
      for (let chunk of translation.chunks) {
        if (chunk.isIgnored) {
          continue;
        }

        const formKey = chunk.form.toString();
        if (!formKey) {
          continue; // Empty Form (ex. proper nouns)
        }

        let formCommonalities = unsortedFormChunks[formKey];
        if (!formCommonalities) {
          formCommonalities = new Commonalities(Commonalities.TYPE_FORM, chunk.form);
          unsortedFormChunks[formKey] = formCommonalities;
        }
        formCommonalities.push(
          new ComparableChunk(chunk, translation)
        );
      }
    }
    // Sort and store
    const sortedCommonalityFormEntries = Object.entries(unsortedFormChunks).sort((c1, c2) =>
      c2[1].count - c1[1].count
    );
    sortedCommonalityFormEntries.forEach(([hashKey, commonalities]) => {
      this.commonFormChunks.set(hashKey, commonalities);
    });
  }

  buildRootWordCommonalities() {
    let unsortedWordChunks = {};
    for (let translation of this.translations) {
      if (!translation.chunks?.length) {
        console.error("No chunks for translation?")
      }
      for (let chunk of translation.chunks) {
        if (chunk.isIgnored) {
          continue;
        }
        
        const rootWordKey = chunk.word.rootWord?.word;
        if (!rootWordKey) {
          if (process.argv.includes("debug")) {
            console.log("Missing root word for word: `" + chunk.word +"`")
          }
          continue;
        }

        let wordCommonalities = unsortedWordChunks[rootWordKey];
        if (!wordCommonalities) {
          wordCommonalities = new Commonalities(Commonalities.TYPE_WORD, rootWordKey);
          unsortedWordChunks[rootWordKey] = wordCommonalities;
        }
        wordCommonalities.push(
          new ComparableChunk(chunk, translation)
        );
      }
    }
    // Sort and store
    const sortedCommonalityWordEntries = Object.entries(unsortedWordChunks).sort((c1, c2) =>
      c2[1].count - c1[1].count
    );
    sortedCommonalityWordEntries.forEach(([hashKey, commonalities]) => {
      this.commonWordChunks.set(hashKey, commonalities);
    });
  }

}
