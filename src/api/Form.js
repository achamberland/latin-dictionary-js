import FormBuilder from "./FormBuilder.js";
import Mood from "./Mood.js";
import Tense from "./Tense.js";
import Voice from "./Voice.js";

export default class Form {
  static EMPTY = new FormBuilder().build();

  static IND_PRES_ACT = Form.of(Mood.INDICATIVE, Tense.PRESENT, Voice.ACTIVE);
  static IND_PRES_PASS = Form.of(Mood.INDICATIVE, Tense.PRESENT, Voice.PASSIVE);
  static IND_IMPERF_ACT = Form.of(Mood.INDICATIVE, Tense.IMPERFECT, Voice.ACTIVE);
  static IND_IMPERF_PASS = Form.of(Mood.INDICATIVE, Tense.IMPERFECT, Voice.PASSIVE);
  static IND_FUT_ACT = Form.of(Mood.INDICATIVE, Tense.FUTURE, Voice.ACTIVE);
  static IND_FUT_PASS = Form.of(Mood.INDICATIVE, Tense.FUTURE, Voice.PASSIVE);
  static IND_PERF_ACT = Form.of(Mood.INDICATIVE, Tense.PERFECT, Voice.ACTIVE);
  static IND_PERF_PASS = Form.of(Mood.INDICATIVE, Tense.PERFECT, Voice.PASSIVE);
  static IND_PLUP_ACT = Form.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
  static IND_PLUP_PASS = Form.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
  static IND_FUTP_ACT = Form.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.ACTIVE);
  static IND_FUTP_PASS = Form.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.PASSIVE);
  
  static SJV_PRES_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.ACTIVE);
  static SJV_PRES_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.PASSIVE);
  static SJV_IMPERF_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.IMPERFECT, Voice.ACTIVE);
  static SJV_IMPERF_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.IMPERFECT, Voice.PASSIVE);
  static SJV_PERF_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PERFECT, Voice.ACTIVE);
  static SJV_PERF_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PERFECT, Voice.PASSIVE);
  static SJV_PLUP_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
  static SJV_PLUP_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
  
  static INF_PRES_ACT = Form.of(Mood.INFINITIVE, Tense.PRESENT, Voice.ACTIVE);
  static INF_PRES_PASS = Form.of(Mood.INFINITIVE, Tense.PRESENT, Voice.PASSIVE);
  static INF_PERF_ACT = Form.of(Mood.INFINITIVE, Tense.PERFECT, Voice.ACTIVE);
  static INF_PERF_PASS = Form.of(Mood.INFINITIVE, Tense.PERFECT, Voice.PASSIVE);
  static INF_FUT_ACT = Form.of(Mood.INFINITIVE, Tense.FUTURE, Voice.ACTIVE);
  static INF_FUT_PASS = Form.of(Mood.INFINITIVE, Tense.FUTURE, Voice.PASSIVE);

  static PTCP_PRES_ACT = Form.of(Mood.PARTICIPLE, Tense.PRESENT, Voice.ACTIVE);
  static PTCP_PERF_PASS = Form.of(Mood.PARTICIPLE, Tense.PERFECT, Voice.PASSIVE);
  static PTCP_FUT_ACT = Form.of(Mood.PARTICIPLE, Tense.FUTURE, Voice.ACTIVE);
  static PTCP_FUT_PASS = Form.of(Mood.PARTICIPLE, Tense.FUTURE, Voice.PASSIVE);
  
  static IMP_PRES_ACT = Form.of(Mood.IMPERATIVE, Tense.PRESENT, Voice.ACTIVE);
  static IMP_PRES_PASS = Form.of(Mood.IMPERATIVE, Tense.PRESENT, Voice.PASSIVE);
  static IMP_FUT_ACT = Form.of(Mood.IMPERATIVE, Tense.FUTURE, Voice.ACTIVE);
  static IMP_FUT_PASS = Form.of(Mood.IMPERATIVE, Tense.FUTURE, Voice.PASSIVE);

  static of = (...parts) => {
    return new FormBuilder(parts).build();
  }

  constructor(person, plurality, modus, tempus, genusVerbi, casus, genus, degree) {
    this.person = person;
    this.plurality = plurality;
    this.mood = modus;
    this.tense = tempus;
    this.voice = genusVerbi;
    this.casus = casus;
    this.gender = genus;
    this.degree = degree;
    this.attributeNames = ["person", "plurality", "mood", "tense", "voice", "casus", "gender"];
  }
  
  toBuilder() {
    return new FormBuilder(this);
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
