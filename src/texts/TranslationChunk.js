
/*
 * Represents a single unit of a translation list.
 * Normally that means one word, along with english prepositions & pronouns if needed
 */
export default class TranslationChunk {

  /**
   * 
   * @param {*Word} word 
   * @param {*string} text 
   * @param {*string} english
   * @param {*Word[]} alternates - Other wordOptions for latin text
   * @param {*bool} isIgnored - Do not use if true
   */
  constructor(word, chunk, latin, english, englishTransforms, alternates, isIgnored = false) {
    this.word = word;
    this.chunk = chunk;
    this.latin = latin;
    this.english = english;
    this.englishTransforms = englishTransforms;
    this.alternates = alternates;
    this.isIgnored = isIgnored;
  }

  get form() {
    return this.word.form;
  }

  get definition() {
    return this.word.definition;
  }

  toEnglish(surroundingChunks, translation) {
    return this.englishTransforms.reduce((accumulator, transformer) =>
      transformer(accumulator, this, surroundingChunks, translation)
    , this.english);
  }

  toString() {
    return `Latin: ${this.latin} | English: ${this.toEnglish()} | Word: ${this.word}`;
  }
}