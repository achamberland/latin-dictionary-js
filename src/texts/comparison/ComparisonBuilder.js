import Commonalities from "./models/Commonalities.js";
import ComparableChunk from "./models/ComparableChunk.js";


export default class ComparisonBuilder {

  constructor(translations) {
    this.translations = translations;
    this.commonFormChunks = {};
    this.commonWordChunks = {};
  }

  buildComparison() {
    let unsortedFormChunks = {};
    for (let translation of this.translations) {
      if (!translation.chunks?.length) {
        console.error("No chunks for translation?")
      }
      for (let chunk of translation.chunks) {
        if (chunk.isIgnored) {
          continue;
        }

        const formHash = chunk.form.toString();
        if (!formHash) {
          continue; // Empty Form (ex. proper nouns)
        }

        // Forms
        let formCommonalities = unsortedFormChunks[formHash];
        if (!formCommonalities) {
          formCommonalities = new Commonalities(Commonalities.TYPE_FORM, chunk.form);
          unsortedFormChunks[formHash] = formCommonalities;
        }
        const comparison = new ComparableChunk(chunk, translation);
        formCommonalities.push(comparison);
        // Words
      }
    }
    // Build (sorted) Map
    this.commonFormChunks = new Map();
    const sortedCommonalityEntries = Object.entries(unsortedFormChunks).sort((c1, c2) =>
      c2[1].count - c1[1].count
    );
    sortedCommonalityEntries.forEach(([hashKey, commonalities]) => {
      this.commonFormChunks.set(hashKey, commonalities);
    });
    return this.commonFormChunks;
  }

}
