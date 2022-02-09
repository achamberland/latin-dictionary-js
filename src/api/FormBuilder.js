import Case from "./Case.js";
import Degree from "./Degree.js";
import Form from "./Form.js";
import Gender from "./Gender.js";
import Mood from "./Mood.js";
import Person from "./Person.js";
import Plurality from "./Plurality.js";
import Tense from "./Tense.js";
import Voice from "./Voice.js";

export default class FormBuilder {
  static of = (...parts) => {
    return new FormBuilder(...parts).build();
  }
  
  static EMPTY = new FormBuilder().build();

  constructor(...args) {
    if (!args || args.length === 0) {
      return;
    }
    console.log(args)
    if (args[0] instanceof FormBuilder || args[0] instanceof Form) {
      const builder = args[0];
      this.person = builder.person;
      this.plurality = builder.plurality;
      this.mood = builder.mood;
      this.tense = builder.tense;
      this.voice = builder.voice;
      this.casus = builder.casus;
      this.gender = builder.gender;
      this.degree = builder.degree;
    } else {
      for (let part of args) {
        if (part === Person) {
          this.person = part;
        } else if (part instanceof Number) {
          person = Person[part - 1];
        } else if (part instanceof Plurality) {
          this.plurality = part;
        } else if (part instanceof Mood) {
          this.mood = part;
        } else if (part instanceof Tense) {
          this.tense = part;
        } else if (part instanceof Voice) {
          this.voice = part;
        } else if (part instanceof Case) {
          this.casus = part;
        } else if (part instanceof Gender) {
          this.gender = part;
        } else if (part instanceof Degree) {
          this.degree = part;
        } else {
          throw new Error(part)
        }
      }
    }
  }

  build() {
    return new Form(
      this.person, this.plurality, this.mood, this.tense, this.voice, this.casus, this.gender, this.degree
    );
  }

  /**
   * Set a single aspect of the Form determined by the given string.
   * 
   * @param {string} s
   */
   setAspect(string) {
    string = string.toUpperCase();
    switch (string.charAt(0)) {
      case '1':
        this.person = Person.FIRST;
        return true;
      case '2':
        this.person = Person.SECOND;
        return true;
      case '3':
        this.person = Person.THIRD;
        return true;
      case 'A':
        if (string.startsWith("ACT")) {
          this.voice = Voice.ACTIVE;
        } else if (string.startsWith("ABL")) {
          this.casus = Case.ABLATIVE;
        } else if (string.startsWith("ACC")) {
          this.casus = Case.ACCUSATIVE;
        } else {
          return false;
        }
        return true;
      case 'D':
        if (string.startsWith("DAT")) {
          this.casus = Case.DATIVE;
        } else {
          return false;
        }
        return true;
      case 'F':
        if (string.startsWith("FUT")) {
          if (string.endsWith("P") || string.endsWith("2")) {
            this.tense = Tense.FUTURE_PERFECT;
          } else {
            this.tense = Tense.FUTURE;
          }
        } else {
          this.gender = Gender.FEMININE;
        }
        return true;
      case 'G':
        if (string.startsWith("GERUND")) {
          this.mood = Mood.GERUND;
        } else if (string.startsWith("GERUNDIVUM")) {
          this.mood = Mood.GERUNDIVE;
        } else if (string.startsWith("GEN")) {
          this.casus = Case.GENITIVE;
        } else {
          return false;
        }
        return true;
      case 'I':
        if (string.startsWith("IND")) {
          this.mood = Mood.INDICATIVE;
        } else if (string.startsWith("INF")) {
          this.mood = Mood.INFINITIVE;
        } else if (string.startsWith("IMPF") || string.startsWith("IMPERF")) {
          this.tense = Tense.IMPERFECT;
        } else if (string.startsWith("IMP")) {
          if (this.mood != null || this.person != null) {
            this.tense = Tense.IMPERFECT;
          } else {
            this.mood = Mood.IMPERATIVE;
          }
        }
        return true;
      case 'M':
        this.gender = Gender.MASCULINE;
        return true;
      case 'N':
        if (string.startsWith("NO")) {
          this.casus = Case.NOMINATIVE;
        } else {
          this.gender = Gender.NEUTER;
        }
        return true;
      case 'P':
        if (string.startsWith("PAS")) {
          this.voice = Voice.PASSIVE;
        } else if (string.startsWith("PART")) {
          this.mood = Mood.PARTICIPLE;
        } else if (string.startsWith("PERF")) {
          this.tense = Tense.PERFECT;
        } else if (string.startsWith("PLUS")) {
          this.tense = Tense.PAST_PERFECT;
        } else if (string.startsWith("PL")) {
          this.plurality = Plurality.PLURAL;
        } else if (string.startsWith("PRES")) {
          this.tense = Tense.PRESENT;
        } else if (string.startsWith("PRET")) {
          this.tense = Tense.IMPERFECT;
        } else {
          return false;
        }
        return true;
      case 'S':
        if (string.startsWith("SJV")) {
          this.mood = Mood.SUBJUNCTIVE;
        } else {
          this.plurality = Plurality.SINGULAR;
        }
        return true;
      case 'V':
        if (string.startsWith("VOC")) {
          this.casus = Case.VOCATIVE;
        } else {
          return false;
        }
        break;
      default:
        return false;
    }
  }
}
