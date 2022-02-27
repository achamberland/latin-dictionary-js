
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
   * @param {*Object} wordTypeData - Data specific to word's wordType
   * @param {*Word[]} alternates - Other wordOptions for latin text
   * @param {*bool} isIgnored - Do not use if true
   */
  constructor(word, chunk, latin, english, wordTypeData, alternates, isIgnored = false) {
    this.word = word;
    this.latin = latin;
    this.english = english;
    this.wordTypeData = wordTypeData;
    this.alternates = alternates;
    this.isIgnored = isIgnored;
  }

  get form() {
    return this.word.form;
  }

  get definition() {
    return this.word.definition;
  }
}