
export default class TranslationChunk {

  /**
   * 
   * @param {*Word} word 
   * @param {*string} text 
   * @param {*string} english
   * @param {*Word[]} alternates 
   */
  constructor(word, text, english, alternates) {
    this.word = word;
    this.text = text;
    this.english = english
    this.alternates = alternates;
  }

  get form() {
    return this.word.form;
  }

  get definition() {
    return this.word.definition;
  }
}