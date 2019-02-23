package org.kobjects.nlp.latin;

import java.util.Arrays;
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
      String[] s = ((String) data[pos + 1]).split(",");
      for (int i = 0; i < s.length; i++) {
        s[i] = s[i].trim();
      }
      switch (base.mood) {
      case INDICATIVE:
      case SUBJUNCTIVE:
        if (s.length == 1) {
          String[] forms = new String[6];
          for (int i = 0; i < forms.length; i++) {
            forms[i] = s[0] + Conjugations.INVARIANT_SUFFIXES.get(base)[i];
          }
          s = forms;
        }
        int i = 0;
        FormBuilder builder = new FormBuilder(base);
        for (Number number : Number.values()) {
          builder.number = number;
          for (Person person : Person.values()) {
            builder.person = person;
            map.put(builder.build(), s[i++]);
          }
        }
        builder.number = null;
        builder.person = null;
        break;
      case INFINITIVE:
        if (s.length != 1) {
          throw new RuntimeException("One entry expexted for "+ base.mood + "; got: "+ Arrays.toString(s));
        }
        map.put(base, s[0]);
        break;
      default:
        throw new RuntimeException("Unsupported mood: " + base.mood);
      }
    }
  }
  
  void buildGenderVariants(Map<Form,String> result, Form form, String stem, String suffix) {
    FormBuilder builder = new FormBuilder(form);
    for (Gender gender : Gender.values()) {
      builder.gender = gender;
      String genderSuffix;
      switch (gender) {
      case MASCULINE:
        genderSuffix = form.number == Number.SINGULAR ? "us" : "i";
        break;
      case FEMININE:
        genderSuffix = form.number == Number.SINGULAR ? "a" : "ae";
        break;
      case NEUTER:
        genderSuffix = form.number == Number.SINGULAR ? "um" : "a";
        break;
      default:
        throw new IllegalArgumentException();
      }
      result.put(builder.build(), stem + genderSuffix + ' ' + suffix);   
    }
  }
  
  Map<Form, String> apply(String presentStem, String infinitive, String perfectStem, String passiveStem, String supineStem) {
    LinkedHashMap<Form, String> result = new LinkedHashMap<Form, String>();
    for (Mood mood : new Mood[] {Mood.INDICATIVE, Mood.SUBJUNCTIVE}) {
      for (Voice voice : Voice.values()) {
        for (Tense tense : Tense.values()) {
          FormBuilder builder = new FormBuilder(mood, voice, tense);
          String[] suffixes = Conjugations.INVARIANT_SUFFIXES.get(builder.build());
          int index = 0;
          boolean genderVariants = false;
          String stem;
          switch (tense) {
          case FUTURE:
          case PRESENT:
          case IMPERFECT:
            stem = presentStem;
            break;
          case FUTURE_PERFECT:
          case PERFECT:
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
          for (Number number : Number.values()) {
            builder.number = number;
            for (Person person : Person.values()) {
              builder.person = person;
              Form form = builder.build();
              String suffix = map.get(form);
              if (suffix == null && suffixes != null) {
                suffix = suffixes[index];
              }
              if (suffix != null) {
                if (genderVariants) {
                  buildGenderVariants(result, form, stem, suffix);   
                } else {
                  result.put(form, stem + suffix);
                }
              }
              index++;
            }     
          }
        }
      }
    }
    result.put(Form.INF_PRES_ACT, infinitive);
    for (Mood mood : new Mood[] {Mood.INFINITIVE}) {        
      for (Voice voice : Voice.values()) {
        for (Tense tense : Tense.values()) {
          Form form = new FormBuilder(mood, voice, tense).build();
          String suffix = map.get(form);
          if (suffix == null) {
            String[] suffixes = Conjugations.INVARIANT_SUFFIXES.get(form);
            if (suffixes != null) {
              suffix = suffixes[0];
            }
          }
          if (suffix == null) {
            continue;
          }
          switch (tense) {
          case PRESENT:
          case IMPERFECT:
            result.put(form, presentStem + suffix);
            break;
          case FUTURE:
            if (voice == Voice.ACTIVE) {
              for (Number number : Number.values()) {
                FormBuilder specific = new FormBuilder(form);
                specific.number = number;
                buildGenderVariants(result, specific.build(), supineStem + "ur", suffix);
              }
            } else {
              result.put(form, supineStem + "um " + suffix);
            }
            break;
          case PERFECT:
          case PAST_PERFECT:
          case FUTURE_PERFECT:
            if (voice == Voice.ACTIVE) {
              result.put(form, perfectStem + suffix);
            } else {
              for (Number number : Number.values()) {
                FormBuilder specific = new FormBuilder(form);
                specific.number = number;
                buildGenderVariants(result, specific.build(), passiveStem, suffix);
              }
            }
            break;
          }
        }
      }
    }
    return result;
  }

}