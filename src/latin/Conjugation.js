import { FormBuilder } from "../api/Forms.js";
import * as FormTypes from "../api/FormTypes.js";
import Gender from "../api/Gender.js";
import Mood from "../api/Mood.js";
import Person from "../api/Person.js";
import Plurality from "../api/Plurality.js";
import Voice from "../api/Voice.js";
import Conjugations, { INVARIANT_SUFFIX_MAX_AMOUNT } from "./Conjugations.js";
import Declinator from "./Declinator.js";
import Tense from "../api/Tense.js";
import { fill } from "../api/Strings.js";

/** Stores conjugation information for a conjugation class or irregular verb. */
export default class Conjugation {
  /**
   * Expected parameters are alternating form instances and strings. The strings
   * contain the suffixes for the sub-forms of the given forms.
   */
  constructor(...data) {
    this.map = new Map();
    for (let pos = 0; pos < data.length; pos += 2) {
      const base = data[pos];
      if (base == null) {
        continue;
      }
      let strings = data[pos + 1].toString().split(",", -1);
      for (let i = 0; i < strings.length; i++) {
        strings[i] = strings[i].trim();
        if (strings[i] === "-") {
          strings[i] = null;
        }
      }
      switch (base.mood) {
        case INDICATIVE:
        case SUBJUNCTIVE:
        case IMPERATIVE:
          if (strings.length === 1) {
            let forms = new Array(INVARIANT_SUFFIX_MAX_AMOUNT);
            for (let i = 0; i < forms.length; i++) {
              forms.push(strings[0] + Conjugations.INVARIANT_SUFFIXES.get(base)[i]);
            }
            strings = forms;
          }
          const builder = new FormBuilder(base);
          Object.values(Plurality).forEach((plurality, numberIndex) => {
            builder.plurality = plurality;
            Object.values(Person).forEach(person => {
              builder.person = person;
              this.map.set(builder.build(), strings[numberIndex + 1]);
            });
          });
          builder.plurality = null;
          builder.person = null;
          break;
        case INFINITIVE:
        case PARTICIPLE:
          if (strings.length !== 1) {
            throw new Error("One entry expexted for "+ base.mood + "; got: "+ strings.join(", "));
          }
          this.map.set(base, strings[0]);
          break;
        default:
          throw new Error("Unsupported mood: " + base.mood);
        }
    }
  }
  
  buildGenderVariants(result, form, stem, suffix) {
    const builder = new FormBuilder(form);
    for (let gender of Object.values(Gender)) {
      builder.gender = gender;
      let genderSuffix = "";
      switch (gender) {
        case MASCULINE:
          genderSuffix = form.plurality === Plurality.SINGULAR ? "us" : "i";
          break;
        case FEMININE:
          genderSuffix = form.plurality === Plurality.SINGULAR ? "a" : "ae";
          break;
        case NEUTER:
          genderSuffix = form.plurality === Plurality.SINGULAR ? "um" : "a";
          break;
        default:
          throw new Error("Unexpected gender: " + gender);
      }
      result.set(builder.build(), stem + genderSuffix + ' ' + suffix);   
    }
    return result;
  }
  
  getUnpersonalizedSuffix(form) {
    const suffix = this.map.get(form);
    if (suffix != null) {
      return suffix;
    } 
    const suffixes = Conjugations.INVARIANT_SUFFIXES.get(form);
    if (suffixes != null) {
      return suffixes[0];
    }
    return suffix;
  }
  
  apply(presentStem, infinitive, perfectStem, passiveStem, supineStem) {
    const result = new Map();
    for (let mood of [Mood.INDICATIVE, Mood.SUBJUNCTIVE, Mood.IMPERATIVE]) {
      for (let voice of Object.values(Voice)) {
        for (let tense of Object.values(Tense)) {
          const builder = new FormBuilder(mood, voice, tense);
          const suffixes = Conjugations.INVARIANT_SUFFIXES.get(builder.build());
          let index = 0;
          let genderVariants = false;
          let stem = null;
          switch (tense) {
            case FUTURE:
            case PRESENT:
            case IMPERFECT:
              stem = presentStem;
              break;
            case FUTURE_PERFECT:
            case PERFECT:
            case PAST_PERFECT:
              if (voice === Voice.ACTIVE) {
                stem = perfectStem;
              } else {
                stem = passiveStem;
                genderVariants = true;
              }
              break;
            default:
              throw new Error("Invalid tense: " + tense);
          }
          if (stem == null) {
            continue;
          }
          for (let plurality of Object.values(Plurality)) {
            builder.plurality = plurality;
            for (let person of Object.values(Person)) {
              builder.person = person;
              const form = builder.build();
              let suffix = this.map.get(form);
              if (suffix == null && suffixes != null) {
                suffix = suffixes[index];
              }
              if (suffix != null) {
                if (genderVariants) {
                  result = this.buildGenderVariants(result, form, stem, suffix);   
                } else {
                  result.set(form, stem + suffix);
                }
              }
              index++;
            }     
          }
        }
      }
    }
    result.set(FormTypes.INF_PRES_ACT, infinitive);
    for (let voice of Object.values(Voice)) {
      for (let tense of Object.values(Tense)) {
        const form = new FormBuilder(Mood.INFINITIVE, voice, tense).build();
        const suffix = this.getUnpersonalizedSuffix(form);
        if (suffix == null) {
          continue;
        }
        switch (tense) {
          case PRESENT:
          case IMPERFECT:
            result.put(form, presentStem + suffix);
            break;
          case FUTURE:
            if (voice === Voice.ACTIVE) {
              for (let plurality of Object.values(Plurality)) {
                const specific = new FormBuilder(form);
                specific.plurality = plurality;
                result = this.buildGenderVariants(result, specific.build(), supineStem + "ur", suffix);
              }
            } else {
              result.put(form, supineStem + "um " + suffix);
            }
            break;
          case PERFECT:
          case PAST_PERFECT:
          case FUTURE_PERFECT:
            if (voice === Voice.ACTIVE) {
              result.put(form, perfectStem + suffix);
            } else {
              for (let plurality of Object.values(Plurality)) {
                const specific = new FormBuilder(form);
                specific.plurality = plurality;
                result = this.buildGenderVariants(result, specific.build(), passiveStem, suffix);
              }
            }
            break;
          default:
            break;
        }
      }
    }
    
    let suffix = this.getUnpersonalizedSuffix(FormTypes.PTCP_PRES_ACT);
    if (suffix != null) {
      const nominative = presentStem + suffix;
      const stem = nominative.substring(0, nominative.length - 2);
      Declinator.decline(result, FormTypes.PTCP_PRES_ACT, Gender.MASCULINE, nominative, stem, 3);
      Declinator.decline(result, FormTypes.PTCP_PRES_ACT, Gender.FEMININE, nominative + suffix, stem, 3);
      Declinator.decline(result, FormTypes.PTCP_PRES_ACT, Gender.NEUTER, nominative, stem, 3);
    }
    if (supineStem != null) {
      Declinator.decline(result, FormTypes.PTCP_PERF_PASS, Gender.MASCULINE, supineStem + "us", supineStem, 2);
      Declinator.decline(result, FormTypes.PTCP_PERF_PASS, Gender.FEMININE, supineStem + "a", supineStem, 1);
      Declinator.decline(result, FormTypes.PTCP_PERF_PASS, Gender.NEUTER, supineStem + "um", supineStem, 2);

      Declinator.decline(result, FormTypes.PTCP_FUT_ACT, Gender.MASCULINE, supineStem + "urus", supineStem + "ur", 2);
      Declinator.decline(result, FormTypes.PTCP_FUT_ACT, Gender.FEMININE, supineStem + "ura", supineStem + "ur", 1);
      Declinator.decline(result, FormTypes.PTCP_FUT_ACT, Gender.NEUTER, supineStem + "urum", supineStem + "ur", 2);

      suffix = this.getUnpersonalizedSuffix(FormTypes.PTCP_FUT_PASS);
      if (suffix != null) {
        const stem = presentStem + suffix;
        Declinator.decline(result, FormTypes.PTCP_FUT_PASS, Gender.MASCULINE, stem + "us", stem, 2);
        Declinator.decline(result, FormTypes.PTCP_FUT_PASS, Gender.FEMININE, stem + "a", stem, 1);
        Declinator.decline(result, FormTypes.PTCP_FUT_PASS, Gender.NEUTER, stem + "um", stem, 2);
      }
    }
    return result;
  }

}
