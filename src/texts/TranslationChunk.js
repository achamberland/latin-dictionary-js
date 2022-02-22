
export default class TranslationChunk {

  /**
   * 
   * @param {*Word} word 
   * @param {*string} text 
   * @param {*Word[]} alternates 
   */
  constructor(word, text, alternates) {
    this.word = word;
    this.text = text;
    this.alternates = alternates;
  }

}