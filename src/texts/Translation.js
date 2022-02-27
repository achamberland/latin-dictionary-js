


export const ENGLISH_ARTICLES = {
  0: "",
  1: "a",
  2: "the",
};

export default class Translation {

  constructor(name, chunks, json) {
    this.name = name;
    this.chunks = chunks;
    this.json = json;
  }

  toEnglish() {
    const ordered = this.chunks;
    const prefixedSuffixed = ordered
    return prefixedSuffixed.map((chunk) => chunk.english).join(" ");
  }

}