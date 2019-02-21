package org.kobjects.nlp.latin;

import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Gender;
import org.kobjects.nlp.api.MapBuilder;
import org.kobjects.nlp.api.Mood;
import org.kobjects.nlp.api.Number;
import org.kobjects.nlp.api.Person;
import org.kobjects.nlp.api.Tense;
import org.kobjects.nlp.api.Voice;

/** Stores conjugation information for a conjugation class or irregular verb. */
class Conjugation {
  final LinkedHashMap<Form, String> map = new LinkedHashMap<>();

  /**
   * Expected parameters are alternating form instances and strings. The strings
   * contain the suffixes for the sub-forms of the given forms.
   */
  Conjugation(Object... data) {
    for (int pos = 0; pos < data.length; pos += 2) {
      Form base = (Form) data[pos];
      if (base == null) {
        continue;
      }
      FormBuilder builder = new FormBuilder(base);
      String[] s = ((String) data[pos + 1]).split(",");
      for (int i = 0; i < s.length; i++) {
        s[i] = s[i].trim();
      }
      switch (builder.mood) {
      case INDICATIVE:
      case SUBJUNCTIVE:
        if (s.length == 1) {
          String[] forms = new String[6];
          for (int i = 0; i < forms.length; i++) {
            forms[i] = s[0] + Conjugations.PERSONAL_SUFFIXES.get(base)[i];
          }
          s = forms;
        }
        int i = 0;
        for (Number number : Number.values()) {
          builder.number = number;
          for (Person person : Person.values()) {
            builder.person = person;
            map.put(builder.build(), s[i++]);
          }
        }
        break;
      default:
        throw new RuntimeException("Unsupported mood: " + builder.mood);
      }
    }
  }

  Map<Form, String> apply(String presentStem, String perfectStem, String passiveStem) {
    LinkedHashMap<Form, String> result = new LinkedHashMap<Form, String>();
    FormBuilder builder = new FormBuilder();
    for (Mood mood : new Mood[] {Mood.INDICATIVE, Mood.SUBJUNCTIVE}) {
      builder.mood = mood;
      for (Voice voice : Voice.values()) {
        builder.voice = voice;
        for (Tense tense : Tense.values()) {
          builder.tense = tense;
          String[] suffixes = Conjugations.PERSONAL_SUFFIXES.get(builder.build());
          int index = 0;
          for (Number number : Number.values()) {
            boolean genderVariants = false;
            builder.number = number;
            String stem;
            switch (tense) {
            case FUTURE:
            case PRESENT:
            case IMPERFEKT:
              stem = presentStem;
              break;
            case FUTURE_PERFECT:
            case PERFEKT:
            case PAST_PERFECT:
              if (voice == Voice.ACTIVE) {
                stem = perfectStem;
              } else {
                stem = passiveStem;
                genderVariants = true;
              }
              break;
            default:
              throw new IllegalStateException();
            }
            for (Person person : Person.values()) {
              builder.person = person;
              String suffix = map.get(builder.build());
              if (suffix == null && suffixes != null) {
                suffix = suffixes[index];
              }
              if (suffix != null) {
                if (genderVariants) {
                  for (Gender gender : Gender.values()) {
                    builder.gender = gender;
                    String genderSuffix;
                    switch (gender) {
                    case MASCULINE:
                      genderSuffix = number == Number.SINGULAR ? "us" : "i";
                      break;
                    case FEMININE:
                      genderSuffix = number == Number.SINGULAR ? "a" : "ae";
                      break;
                    case NEUTER:
                      genderSuffix = number == Number.SINGULAR ? "um" : "a";
                      break;
                    default:
                      throw new IllegalArgumentException();
                    }
                    result.put(builder.build(), stem + genderSuffix + ' ' + suffix);
                    builder.gender = null;
                  }
                } else {
                  result.put(builder.build(), stem + suffix);
                }
              }
              index++;
            }
          }
          builder.person = null;
          builder.number = null;
        }
      }
    }
    return result;
  }

}