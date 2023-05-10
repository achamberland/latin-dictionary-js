

/*
 * Each instance holds an array of ComparableChunks (this.siblings).
 */
export default class Commonalities {
  static TYPE_FORM = "form";
  static TYPE_WORD = "word";
  static TYPES = [this.TYPE_FORM, this.TYPE_WORD];
  
  constructor(type, commonAttribute, siblings = []) {
    // One of this.TYPES
    this.type = type;
    // The root model this was based on, for instance a Form. Must implement toString().
    this.commonAttribute = commonAttribute;
    // Can be added to via this.push as well
    this.siblings = siblings;
  }

  get count() {
    return this.siblings.length;
  }

  get translationCount() {
    const uniqueTranslations = new Set(
      this.siblings.map(comparable => comparable.translation)
    );
    return uniqueTranslations.size;
  }

  push(sibling) {
    this.siblings.push(sibling);
  }

  toString() {
    const attributeString = this.commonAttribute?.toString?.() || this.commonAttribute;
    console.log(
      `Common Attribute: ${this.type}(${attributeString})\n` +
      `Commonalities found: ${this.count}\n\n` +
      `Items:\n${this.siblings.map(sibling => sibling.toString()).join("\n")}\n\n\n`
    );
  }

}