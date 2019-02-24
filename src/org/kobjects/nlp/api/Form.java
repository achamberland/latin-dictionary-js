package org.kobjects.nlp.api;

import java.util.Objects;

public class Form {
  public static final Form EMPTY = new FormBuilder().build();

  public static final Form IND_PRES_ACT = Form.of(Mood.INDICATIVE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form IND_PRES_PASS = Form.of(Mood.INDICATIVE, Tense.PRESENT, Voice.PASSIVE);
  public static final Form IND_IMPERF_ACT = Form.of(Mood.INDICATIVE, Tense.IMPERFECT, Voice.ACTIVE);
  public static final Form IND_IMPERF_PASS = Form.of(Mood.INDICATIVE, Tense.IMPERFECT, Voice.PASSIVE);
  public static final Form IND_FUT_ACT = Form.of(Mood.INDICATIVE, Tense.FUTURE, Voice.ACTIVE);
  public static final Form IND_FUT_PASS = Form.of(Mood.INDICATIVE, Tense.FUTURE, Voice.PASSIVE);
  public static final Form IND_PERF_ACT = Form.of(Mood.INDICATIVE, Tense.PERFECT, Voice.ACTIVE);
  public static final Form IND_PERF_PASS = Form.of(Mood.INDICATIVE, Tense.PERFECT, Voice.PASSIVE);
  public static final Form IND_PLUP_ACT = Form.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
  public static final Form IND_PLUP_PASS = Form.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
  public static final Form IND_FUTP_ACT = Form.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.ACTIVE);
  public static final Form IND_FUTP_PASS = Form.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.PASSIVE);
  
  public static final Form SJV_PRES_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form SJV_PRES_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.PASSIVE);
  public static final Form SJV_IMPERF_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.IMPERFECT, Voice.ACTIVE);
  public static final Form SJV_IMPERF_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.IMPERFECT, Voice.PASSIVE);
  public static final Form SJV_PERF_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PERFECT, Voice.ACTIVE);
  public static final Form SJV_PERF_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PERFECT, Voice.PASSIVE);
  public static final Form SJV_PLUP_ACT = Form.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
  public static final Form SJV_PLUP_PASS = Form.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
  
  public static final Form INF_PRES_ACT = Form.of(Mood.INFINITIVE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form INF_PRES_PASS = Form.of(Mood.INFINITIVE, Tense.PRESENT, Voice.PASSIVE);
  public static final Form INF_PERF_ACT = Form.of(Mood.INFINITIVE, Tense.PERFECT, Voice.ACTIVE);
  public static final Form INF_PERF_PASS = Form.of(Mood.INFINITIVE, Tense.PERFECT, Voice.PASSIVE);
  public static final Form INF_FUT_ACT = Form.of(Mood.INFINITIVE, Tense.FUTURE, Voice.ACTIVE);
  public static final Form INF_FUT_PASS = Form.of(Mood.INFINITIVE, Tense.FUTURE, Voice.PASSIVE);

  public static final Form PTCP_PRES_ACT = Form.of(Mood.PARTICIPLE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form PTCP_PERF_PASS = Form.of(Mood.PARTICIPLE, Tense.PERFECT, Voice.PASSIVE);
  public static final Form PTCP_FUT_ACT = Form.of(Mood.PARTICIPLE, Tense.FUTURE, Voice.ACTIVE);
  public static final Form PTCP_FUT_PASS = Form.of(Mood.PARTICIPLE, Tense.FUTURE, Voice.PASSIVE);
  
  public static final Form IMP_PRES_ACT = Form.of(Mood.IMPERATIVE, Tense.PRESENT, Voice.ACTIVE);
  public static final Form IMP_PRES_PASS = Form.of(Mood.IMPERATIVE, Tense.PRESENT, Voice.PASSIVE);
  public static final Form IMP_FUT_ACT = Form.of(Mood.IMPERATIVE, Tense.FUTURE, Voice.ACTIVE);
  public static final Form IMP_FUT_PASS = Form.of(Mood.IMPERATIVE, Tense.FUTURE, Voice.PASSIVE);

  public static Form of(Object... parts) {
    return new FormBuilder(parts).build();
  }

  public final Person person;
  public final Number number;
  public final Mood mood;
  public final Tense tense;
  public final Voice voice;
  public final Case casus;
  public final Gender gender;
  public final Degree degree;

  Form(Person person, Number numerus, Mood modus, Tense tempus, Voice genusVerbi, Case casus, Gender genus,
      Degree degree) {
    this.person = person;
    this.number = numerus;
    this.mood = modus;
    this.tense = tempus;
    this.voice = genusVerbi;
    this.casus = casus;
    this.gender = genus;
    this.degree = degree;
  }
  
  public FormBuilder toBuilder() {
    return new FormBuilder(this);
  }

  public String toString() {
    StringBuilder sb = new StringBuilder();
    if (person != null) {
      sb.append(this.person).append(". ");
      if (number != null) {
        sb.append(this.number).append(' ');
      }
    }
    if (mood != null) {
      sb.append(mood).append(' ');
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
    return Objects.hash(person, number, mood, tense, voice, casus, gender);
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof Form)) {
      return false;
    }
    Form other = (Form) o;
    return Objects.equals(person, other.person) && Objects.equals(number, other.number)
        && Objects.equals(mood, other.mood) && Objects.equals(tense, other.tense)
        && Objects.equals(voice, other.voice) && Objects.equals(casus, other.casus)
        && Objects.equals(gender, other.gender);
  }
}
