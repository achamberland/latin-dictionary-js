package org.kobjects.nlp.api;

import java.util.Objects;

public class Form {
  public static final Form EMPTY = new FormBuilder().build();

  public static final Form IND_PRES_ACT = Form.of(Mood.INDICATIVE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form IND_PRES_PASS = Form.of(Mood.INDICATIVE, Tense.PRESENT, Voice.PASSIVE);
  public static final Form IND_IMPERF_ACT = Form.of(Mood.INDICATIVE, Tense.IMPERFEKT, Voice.ACTIVE);
  public static final Form IND_IMPERF_PASS = Form.of(Mood.INDICATIVE, Tense.IMPERFEKT, Voice.PASSIVE);
  public static final Form IND_FUT_ACT = Form.of(Mood.INDICATIVE, Tense.FUTURE, Voice.ACTIVE);
  public static final Form IND_FUT_PASS = Form.of(Mood.INDICATIVE, Tense.FUTURE, Voice.PASSIVE);
  public static final Form IND_PERF_ACT = Form.of(Mood.INDICATIVE, Tense.PERFEKT, Voice.ACTIVE);
  public static final Form IND_PERF_PASS = Form.of(Mood.INDICATIVE, Tense.PERFEKT, Voice.PASSIVE);
  public static final Form IND_PLUP_ACT = Form.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
  public static final Form IND_PLUP_PASS = Form.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
  public static final Form IND_FUTP_ACT = Form.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.ACTIVE);
  public static final Form IND_FUTP_PASS = Form.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.PASSIVE);
  
  public static final Form SJV_PRES_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form SJV_PRES_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.PASSIVE);
  public static final Form SJV_IMPERF_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.IMPERFEKT, Voice.ACTIVE);
  public static final Form SJV_IMPERF_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.IMPERFEKT, Voice.PASSIVE);
  public static final Form SJV_PERF_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PERFEKT, Voice.ACTIVE);
  public static final Form SJV_PERF_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PERFEKT, Voice.PASSIVE);
  public static final Form SJV_PLUP_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
  public static final Form SJV_PLUP_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
  
  public static Form of(Object... parts) {
    return new FormBuilder(parts).build();
  }

  public final Person person;
  public final Number number;
  public final Mood modus;
  public final Tense tense;
  public final Voice voice;
  public final Case casus;
  public final Gender gender;
  public final Degree degree;

  Form(Person person, Number numerus, Mood modus, Tense tempus, Voice genusVerbi, Case casus, Gender genus,
      Degree degree) {
    this.person = person;
    this.number = numerus;
    this.modus = modus;
    this.tense = tempus;
    this.voice = genusVerbi;
    this.casus = casus;
    this.gender = genus;
    this.degree = degree;
  }

  public String toString() {
    StringBuilder sb = new StringBuilder();
    if (person != null) {
      sb.append(this.person).append(". ");
      if (number != null) {
        sb.append(this.number).append(' ');
      }
    }
    if (modus != null) {
      sb.append(modus).append(' ');
    }
    if (tense != null) {
      sb.append(tense).append(' ');
    }
    if (voice != null) {
      sb.append(voice).append(' ');
    }
    if (casus != null) {
      sb.append(casus).append(' ');
    }
    if (person == null && number != null) {
      sb.append(number).append(' ');
    }
    if (gender != null) {
      sb.append(gender).append(' ');
    }
    sb.setLength(Math.max(0, sb.length() - 1));
    return sb.toString();
  }

  @Override
  public int hashCode() {
    return Objects.hash(person, number, modus, tense, voice, casus, gender);
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof Form)) {
      return false;
    }
    Form other = (Form) o;
    return Objects.equals(person, other.person) && Objects.equals(number, other.number)
        && Objects.equals(modus, other.modus) && Objects.equals(tense, other.tense)
        && Objects.equals(voice, other.voice) && Objects.equals(casus, other.casus)
        && Objects.equals(gender, other.gender);
  }
}
