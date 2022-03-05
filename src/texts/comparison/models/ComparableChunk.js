
export default class ComparableChunk {
  constructor(chunk, translation) {
    this.chunk = chunk;
    this.translation = translation;
  }

  get form() {
    return this.chunk.form;
  }

  toString() {
    return this.chunk.word.toString();
  }
}