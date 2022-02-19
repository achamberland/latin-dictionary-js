

export default class Codes {
  static CODE_AGE = "age=";
  static CODE_FREQUENCY = "frq=";
  static CODE_SOURCE = "src=";

  static AGE_RANK = {
    archaic: 1, 
    early: 2, 
    classical: 3,
    late: 4,
    later: 5,
    medieval: 6,
    scholar: 7,
    modern: 8,
  };

  constructor(age, frequency, source) {
    this.age = age;
    this.frequency = frequency;
    this.source = source;
  }

  get ageRank() {
    return Codes.AGE_RANK[this.age] || 0;
  }
}
