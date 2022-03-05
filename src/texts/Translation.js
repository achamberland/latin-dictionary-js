import Case from "../api/Case.js";
import WordType from "../api/WordType.js";



export const ENGLISH_ARTICLES = {
  0: "",
  1: "the",
  2: "a",
  3: "an",
};

export default class Translation {

  constructor(name, chunks, json) {
    this.name = name;
    this.chunks = chunks;
    this.json = json;
  }

  toEnglish() {
    const ordered = this.orderChunksForEnglish();
    const prefixedSuffixed = ordered
    return prefixedSuffixed.map(chunk => (
      chunk.toEnglish(this.chunks, this)
    )).join(" ");
  }

  // Remember to transfer punctuation to swapped words!
  orderChunksForEnglish() {
    const reordered = [];
    for (let chunk of this.chunks) {
      let offset = chunk.offset || 0;
      if (!chunk.offset) {
        if (chunk.definition.type === WordType.ADJECTIVE) {
          const reversedChunks = [...reordered].reverse();
          const nounsPreceding = reversedChunks.findIndex((nounChunk) => (
            nounChunk.definition.type === WordType.NOUN
          ));
          if (nounsPreceding > -1) {
            offset = nounsPreceding + 1;
          }
        // } else if (
          // chunk.form.casus === Case.GENITIVE &&
          // reordered[reordered.length - 1].form.casus 
        // ) {
          // offset = -1
        }
      }
      if (offset) {
        reordered.splice(reordered.length - offset, 0, chunk);
      } else {
        reordered.push(chunk);
      }
    }
    return reordered;
  }

}