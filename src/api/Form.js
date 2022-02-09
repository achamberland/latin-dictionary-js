
export default class Form {

  static attributeNames = ["person", "plurality", "mood", "tense", "voice", "casus", "gender"];

  constructor(person, plurality, modus, tempus, genusVerbi, casus, genus, degree) {
    this.person = person;
    this.plurality = plurality;
    this.mood = modus;
    this.tense = tempus;
    this.voice = genusVerbi;
    this.casus = casus;
    this.gender = genus;
    this.degree = degree;
  }

  toString() {
    let sb = "";
    if (this.person != null) {
      sb += this.person + ". ";
      if (this.plurality != null) {
        sb += this.plurality + ' ';
      }
    }
    if (this.mood != null) {
      sb += this.mood + ' ';
    }
    if (this.tense != null) {
      sb += this.tense + ' ';
    }
    if (this.voice != null) {
      sb += this.voice + ' ';
    }
    if (this.casus != null) {
      sb += this.casus + ' ';
    }
    if (this.person == null && this.plurality != null) {
      sb += this.plurality + ' ';
    }
    if (this.gender != null) {
      sb += this.gender + ' ';
    }
    sb = sb.slice(0, sb.length - 1);
    return sb;
  }

  // Not a direct port.
  // Original Java used Object.hashCode
  hashCode() {
    return this.attributeNames.reduce((accumulator, currentName) => (
      `${accumulator}__${this[currentName]}`
    ), "");
  }

  // Compare to another Form or an Object with Form attributes
  equals(compareTo) {
    if (compareTo instanceof Form === false) {
      return false;
    }
    return this.attributeNames.every(attribute => (
      this[attribute]?.toString() === compareTo[attribute]?.toString()
    ));
  }
}
