package org.kobjects.nlp.api;

public class FormBuilder {
  public Person person;
  public Number number;
  public Mood mood;
  public Tense tense;
  public Voice voice;
  public Case casus;
  public Gender gender;
  public Degree degree;

  public FormBuilder(Form form) {
    person = form.person;
    number = form.number;
    mood = form.modus;
    tense = form.tense;
    voice = form.voice;
    casus = form.casus;
    gender = form.gender;
    degree = form.degree;
  }
  
  public FormBuilder(Object... parts) {
    for (Object part : parts) {
      if (part instanceof Person) {
        person = (Person) part;
      } else if (part instanceof Integer) {
        person = Person.values()[((Integer) part) - 1];
      } else if (part instanceof Number) {
        number = (Number) part;
      } else if (part instanceof Mood) {
        mood = (Mood) part;
      } else if (part instanceof Tense) {
        tense = (Tense) part;
      } else if (part instanceof Voice) {
        voice = (Voice) part;
      } else if (part instanceof Case) {
        casus = (Case) part;
      } else if (part instanceof Gender) {
        gender = (Gender) part;
      } else if (part instanceof Degree) {
        degree = (Degree) part;
      }
    }
  }

  public Form build() {
    return new Form(person, number, mood, tense, voice, casus, gender, degree);
  }

  /**
   * Set a single aspect of the form determined by the given string.
   * 
   * @param {string} s
   */
  public boolean setAspect(String string) {
    string = string.toUpperCase();
    switch (string.charAt(0)) {
    case '1':
      person = Person.FIRST;
      break;
    case '2':
      person = Person.SECOND;
      break;
    case '3':
      person = Person.THIRD;
      break;
    case 'A':
      if (string.startsWith("ACT")) {
        voice = Voice.ACTIVE;
      } else if (string.startsWith("ABL")) {
        casus = Case.ABLATIVE;
      } else if (string.startsWith("ACC")) {
        casus = Case.ACCUSATIVE;
      } else {
        return false;
      }
      break;
    case 'D':
      if (string.startsWith("DAT")) {
        casus = Case.DATIVE;
      } else {
        return false;
      }
      break;
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
      break;
    case 'G':
      if (string.startsWith("GERUND")) {
        mood = Mood.GERUND;
      } else if (string.startsWith("GERUNDIVUM")) {
        mood = Mood.GERUNDIVE;
      } else if (string.startsWith("GEN")) {
        casus = Case.GENITIVE;
      } else {
        return false;
      }
      break;
    case 'I':
      if (string.startsWith("IND")) {
        this.mood = Mood.INDICATIVE;
      } else if (string.startsWith("INF")) {
        this.mood = Mood.INFINITIVE;
      } else if (string.startsWith("IMPF") || string.startsWith("IMPERF")) {
        this.tense = Tense.IMPERFEKT;
      } else if (string.startsWith("IMP")) {
        if (mood != null || person != null) {
          this.tense = Tense.IMPERFEKT;
        } else {
          this.mood = Mood.IMPERATIVE;
        }
      }
      break;
    case 'M':
      this.gender = Gender.MASCULINE;
      break;
    case 'N':
      if (string.startsWith("NO")) {
        this.casus = Case.NOMINATIVE;
      } else {
        this.gender = Gender.NEUTER;
      }
      break;
    case 'P':
      if (string.startsWith("PAS")) {
        this.voice = Voice.PASSIVE;
      } else if (string.startsWith("PART")) {
        this.mood = Mood.PARTICIPLE;
      } else if (string.startsWith("PERF")) {
        this.tense = Tense.PERFEKT;
      } else if (string.startsWith("PLUS")) {
        this.tense = Tense.PAST_PERFECT;
      } else if (string.startsWith("PL")) {
        this.number = Number.PLURAL;
      } else if (string.startsWith("PRES")) {
        this.tense = Tense.PRESENT;
      } else if (string.startsWith("PRET")) {
        this.tense = Tense.IMPERFEKT;
      } else {
        return false;
      }
      break;
    case 'S':
      if (string.startsWith("SJV")) {
        this.mood = Mood.SUBJUNCTIVE;
      } else {
        number = Number.SINGULAR;
      }
      break;
    case 'V':
      if (string.startsWith("VOC")) {
        casus = Case.VOCATIVE;
      } else {
        return false;
      }
      break;
    default:
      return false;
    } // switch
    return true;
  }

  public Gender getGenus() {
    return gender;
  }
}