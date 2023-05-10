// package org.kobjects.nlp.latin;

import Degree from "../../constants/Degree.js";
import FormBuilder from "../../models/FormBuilder.js";
import Gender from "../../constants/Gender.js";
import Plurality from "../../constants/Plurality.js";
import Case from "../../constants/Case.js";
import { consonantsOnly, isConsonant, isVowel } from "../../../utils/charUtils.js";

/**
 * Class that is able to decline a Latin noun, given the genus, nominative and
 * genitive case.
 */
export default class Declinator {
  // Special codes in the declension suffix tables: 
  // 1: refers to the Nominative. 
  // /: alternative suffix for neuter provided after the slash.
  
  static UNDECLINED = [
    ["1", "1", "1", "1", "1", "1"], 
    ["1", "1", "1", "1", "1", "1"],
  ];
  
  // A stems
  static FIRST_DECLENSION = [
    ["1",  "ae",   "ae", "am", "a",  "1"],
    ["ae", "arum", "is", "as", "is", "ae"]
  ];

  // O stems
  static SECOND_DECLENSION = [
    ["1",   "i",    "o",  "um",   "o",  "1"],
    ["i/a", "orum", "is", "os/a", "is", "i/a"]
  ];

  // O stem with nominative ending in -us, but not -ius
  static SECOND_DECLENSION_US = [
    ["1",   "i",    "o",  "um",   "o",  "e/um"],
    ["i/a", "orum", "is", "os/a", "is", "i/a"]
  ];

  // O stem with nominative ending in -ius
  static SECOND_DECLENSION_IUS = [
    ["1",   "i",    "o",  "um",   "o",  "/um"],
    ["i/a", "orum", "is", "os/a", "is", "i/a"]
  ];

  // I/consonant stem
  static THIRD_DECLENSION_MIXED = [
    ["1",  "is",  "i",    "em", "e",    "1"],
    ["es", "ium", "ibus", "es", "ibus", "es"]
  ];

  static THIRD_DECLENSION_I = [
    ["1",     "is",  "i",    "im/e",  "i",    "1"],
    ["es/ia", "ium", "ibus", "es/ia", "ibus", "es/ia"]
  ];

  static THIRD_DECLENSION_CONSONANT = [
    ["1",    "is", "i",    "em/1", "e",    "1"],
    ["es/a", "um", "ibus", "es/a", "ibus", "es/a"]
  ];

  // U stems
  static FOURTH_DECLENSION = [
    ["1",     "us",  "ui/u", "um/u",  "u",    "1"],
    ["us/ua", "uum", "ibus", "us/ua", "ibus", "us/ua"]
  ];

  // E stems
  static FIFTH_DECLENSION = [
    ["1",  "ei",   "ei",   "em", "e",    "1"],
    ["es", "erum", "ebus", "es", "ebus", "es"]
  ];
 
// Todo: Implement:
// - 7th possessive
// - Pronoun declension override
// - Reflexive third

  // ______________
  // Irregulars
  // Pronouns (Hacks)
  static PRONOUN_FIRST_PERSON = [
    ["ego", "mei", "mihi", "me", "me",  "ego", "meus"],
    ["nos", "nostrum", "nobis", "nos", "nobis",  "nos", "noster"],
  ];
  static PRONOUN_SECOND_PERSON = [
    ["tu", "tui", "tibi", "te", "te", "tu", "tuus"],
    ["vos", "vostrum", "vobis", "vos", "vobis",  "vos", "voster", "vester"],
  ];
  static PRONOUN_THIRD_PERSON = [
    ["is/id/ea", "eius", "ei", "eum/id/eam", "eo/eo/ea",  "eius"],
    ["ei/eae/ea", "eorum/eorum/earum", "eis", "eos/ea/eas", "eis",  "eorum/eorum/earum"],
  ];
  static PRONOUN_REFLEXIVE_THIRD_PERSON = [
    ["-", "sui", "sibi", "se", "se",  "-"],
    ["-", "sui", "sibi", "se", "se",  "-"],
  ];

  static PRONOUN_IRREGULARS = [
    this.PRONOUN_FIRST_PERSON, this.PRONOUN_SECOND_PERSON,
    this.PRONOUN_THIRD_PERSON, this.PRONOUN_REFLEXIVE_THIRD_PERSON
  ];

  static findStem(nominative) {
    const length = nominative.length;
    if (isVowel(nominative.charAt(length - 1))) {
      return nominative.substring(0, length - 1);
    }
    return nominative.substring(0, length - 2);
  }

  static syllableCount(string) {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      if (isVowel(string.charAt(i))) {
        count++;
      }
    }
    return count;
  }

  /**
   * Returns the declensions of the given word as a map. Words is expected to
   * contain the nominative and the genitive.
   */
  static declineNoun(genus, nominative, genitive) {
    const result = new Map();
    let stem = null;
    let declension = null;
    if (genitive === "undeclined") {
      // Todo: Perhaps this should just return an array with a single entry -- and the case and number unset?
      declension = 0;
      // Todo: Review if still not needed
      stem = null; // not needed -- nominative is inserted everywhere. 
    } else {
      let genitiveSuffix;
      if (genitive.charAt(0) === '-') {
        genitiveSuffix = genitive.substring(1);
      } else {
        const cutCount = genitive.endsWith("i") && !genitive.endsWith("ei") ? 1 : 2;
        genitiveSuffix = genitive.substring(genitive.length - cutCount);
      }
      stem = genitive.substring(0, genitive.length - genitiveSuffix.length);
      switch (genitiveSuffix) {
        case "ae": declension = 1; break;
        case "i":  declension = 2; break;
        case "is": declension = 3; break;
        case "us": declension = 4; break;
        case "ei": declension = 5; break;
        default:
          throw new Error("Declension not recognized for genitive case suffix: '" + genitiveSuffix + "'");
      }
    }
    return this.decline(result, null, genus, nominative, stem, declension);
  }
  
  // TODO: Handle POSS SG/PL modifier

  /**
   * Declines an adjective. The variable words contains the Latin words of
   * defining the dictionary entry.
   */
  static declineAdjective(words) {
    const nominativeMasculine = words[0];
    let result = new Map();

    // Index of the comparative within words.
    let comparativeIndex = -1;
    
    // Basic degree
    if (words.length > 1 && words[1].indexOf(' ') !== -1) {
      // Multiple words in the second entry, split it into its parts.
      let basicParts = words[1].split(" ");
      if (basicParts[1] === "(gen.)" || basicParts[1] === "(gen)") {
        // neclegens, neclegentis (gen.), neclegentior -or -us, neclegentissimus -a -um
        const genitive = basicParts[0];
        const stem = genitive.substring(genitive.length - 2);
        result = this.decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 3);
        result = this.decline(result, null, Gender.FEMININE, nominativeMasculine, stem, 3);
        result = this.decline(result, null, Gender.NEUTER, nominativeMasculine, stem, 3);
        comparativeIndex = 2;
      } else {
        // acutus, acuta -um, acutior -or -us, acutissimus -a -um
        const stem = this.findStem(nominativeMasculine);
        result = this.decline(result, null, Gender.MASCULINE, words[0], stem, 2);
        result = this.decline(result, null, Gender.FEMININE, basicParts[0], stem, 1);
        result = this.decline(result, null, Gender.NEUTER, basicParts[1], stem, 2);
        comparativeIndex = 2;
      }
    } else if (words.length > 2 && words[2].indexOf(' ') > -1) {
      // Multiple words in the third entry:
      // ocis, oce, ocior -or -us, ocissimus -a -um
      const stem = this.findStem(nominativeMasculine);
      result = this.decline(result, null, Gender.MASCULINE, words[0], stem, 3);
      result = this.decline(result, null, Gender.FEMININE, words[0], stem, 3);
      result = this.decline(result, null, Gender.NEUTER, words[1], stem, 3);
      comparativeIndex = 2;
    } else if (words.length === 3) {
      if (words[1] === "(gen.)") {
        // militans, (gen.), militantis
        const genitive = words[2];
        if (!genitive.endsWith("is")) {
          throw new Error("Genitive expected to end with 'is'");
        }
        const stem = genitive.substring(genitive.length - 2);        
        result = this.decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 3);
        result = this.decline(result, null, Gender.FEMININE,  nominativeMasculine, stem, 3);
        result = this.decline(result, null, Gender.NEUTER,  nominativeMasculine, stem, 3);
      } else {
        const nominativeFeminine = words[1];
        const nominativeNeuter = words[2];
        // aleruter/alerutrum, noster/nostrum, etc
        const stemSource = nominativeMasculine.endsWith("er") && nominativeNeuter.match(/[^e]rum$/) ?
          nominativeNeuter :
          nominativeMasculine;
        const stem = this.findStem(stemSource);
        if (words[2].endsWith("e")) {
          // adfectualis, adfectualis, adfectuale
          result = this.decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 3);
          result = this.decline(result, null, Gender.FEMININE, nominativeFeminine, stem, 3);
          result = this.decline(result, null, Gender.NEUTER, nominativeNeuter, stem, 3);
        } else {
          // acquisitus, acquisita, acquisitum
          result = this.decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 2);
          result = this.decline(result, null, Gender.FEMININE, nominativeFeminine, stem, 1);
          result = this.decline(result, null, Gender.NEUTER, nominativeNeuter, stem, 2);
        }
      }
    } else if (words.length === 2) {
      if (words[1] === "undeclined") {
        // adinstar, undeclined
        result = this.decline(result, null, Gender.MASCULINE, words[0], null, 0);
        result = this.decline(result, null, Gender.FEMININE, words[0], null, 0);
        result = this.decline(result, null, Gender.NEUTER, words[0], null, 0);
      } else if (words[1].endsWith("e")) {
        const stem = this.findStem(nominativeMasculine);
        result = this.decline(result, null, Gender.MASCULINE, words[0], stem, 3);
        result = this.decline(result, null, Gender.FEMININE, words[0], stem, 3);
        result = this.decline(result, null, Gender.NEUTER, words[1], stem, 3);
      } else if (words[1].endsWith("is")) {
        const stem = this.findStem(nominativeMasculine);
        result = this.decline(result, null, Gender.MASCULINE, words[0], stem, 3);
        result = this.decline(result, null, Gender.FEMININE, words[0], stem, 3);
        result = this.decline(result, null, Gender.NEUTER, words[0], stem, 3);
      } else {
        throw new Error("Adjective 2-form not recognized: " + words.join(", "));
      }
    } else {
      throw new Error("Unrecognized Ajective declination: " + words.join(", "));
    }

    // comparative and superlative
    if (comparativeIndex !== -1 && comparativeIndex < words.length) {
      let comparativeParts = words[comparativeIndex].split(" ");
      let stem = this.findStem(comparativeParts[0]);
      const comparative = FormBuilder.of(Degree.COPARATIVE);
      result = this.decline(result, comparative, Gender.MASCULINE, comparativeParts[0], stem, 2);
      result = this.decline(result, comparative, Gender.FEMININE, comparativeParts[1], stem, 1);
      result = this.decline(result, comparative, Gender.NEUTER, comparativeParts[2], stem, 2);
      if (comparativeIndex + 1 < words.length && !words[comparativeIndex + 1] === "-") {
        stem = this.findStem(comparativeParts[0]);
        comparativeParts = words[comparativeIndex + 1].split(" ");
        const superlative = FormBuilder.of(Degree.SUPERLATIVE);
        result = this.decline(result, superlative, Gender.MASCULINE, comparativeParts[0], stem, 2);
        result = this.decline(result, superlative, Gender.FEMININE, comparativeParts[1], stem, 1);
        result = this.decline(result, superlative, Gender.NEUTER, comparativeParts[2], stem, 2);
      }
    }
    return result;
  }

  static declinePronoun(genus, nominative, genitive) {
    const irregularMatch = this.PRONOUN_IRREGULARS.find(irregular =>
      irregular.find(irregularRow =>
        irregularRow[0].split("/").includes(nominative) || 
        irregularRow[1].split("/").includes(genitive)
      )
    );
    if (!irregularMatch || !irregularMatch[0]) {
      // Not irregular (nos & vos)
      return this.declineNoun(genus, nominative, genitive);
    }
    return this.decline(new Map(), null, genus, nominative, "", irregularMatch);
  }

  
  /**
   * The actual declension routine, called from noun and adjective declension.
   * @param result map to add the results to
   * @param form optional base form to use
   * @param genus the genus of the noun or adjective
   * @param degree the degree of the adjective
   * @param nominative the nominative case of the word
   * @param stem the stem of the word.
   * @param declension the declension to use (0 for undeclensed or 1..5). 
   */
  static decline(result, form, genus, nominative, stem, declension) {
    // For adjectives, only the (gender specific) nominative suffix may be handed in.
    if (nominative.startsWith("-")) {
      nominative = stem + nominative.substring(1);
    }

    let suffixes;
    if (typeof declension === "object") {
      suffixes = declension;
    } else {
      switch (declension) {
        case 0:
          suffixes = this.UNDECLINED;
          break;
        case 1:
          suffixes = this.FIRST_DECLENSION;
          break;
        case 2:
          if (nominative.endsWith("ius")) {
            suffixes = this.SECOND_DECLENSION_IUS;
          } else if (nominative.endsWith("us")) {
            suffixes = this.SECOND_DECLENSION_US;
          } else {
            suffixes = this.SECOND_DECLENSION
          }
          break;
        case 3:
          const nomintativeEnding = nominative.endsWith("e") ? "e" : nominative.substring(nominative.length - 2);
          const isLongConsonantEnding = (
            stem.length > 2 &&
            consonantsOnly(stem.substring(stem.length - 2))
          );
          const isOtherMixedEnding = (
            ["is", "es"].includes(nomintativeEnding) &&
            this.syllableCount(stem + "is") === this.syllableCount(nominative)
          );
          if (isLongConsonantEnding || isOtherMixedEnding) {
            suffixes = this.THIRD_DECLENSION_MIXED;
          } else if (
            ["is", "e", "al", "ar"].includes(nomintativeEnding) &&
            nominative.substring(0, nominative.length - nomintativeEnding.length) === stem
          ) {
            suffixes = this.THIRD_DECLENSION_I;
          } else {
            suffixes = this.THIRD_DECLENSION_CONSONANT;
          }
          break;
        case 4:
          suffixes = this.FOURTH_DECLENSION;
          break;
        case 5:
          suffixes = this.FIFTH_DECLENSION;
          break;
        default:
          throw new Error("Invalid declension: " + declension);
      }
    }

    const builder = new FormBuilder(form);
    builder.gender = genus;
    const pluralities = Object.values(Plurality);
    for (let n = 0; n < pluralities.length; n++) {
      builder.plurality = pluralities[n];
      const suffixesN = suffixes[n];
      if (!suffixesN) {
        // Skip plurality
        continue;
      }
      const cases = Object.values(Case);
      for (let i = 0; i < cases.length; i++) {
        builder.casus = cases[i];
        let suffix = suffixesN[i];

        // Differently gendered endings: M/N/F
        const neuterCut = suffix.indexOf('/');
        if (neuterCut === -1) {
          suffix = stem + suffix;
        } else {
          if (builder.gender === Gender.NEUTER) {
            suffix = stem + suffix.substring(neuterCut + 1);
          } else {
            suffix = stem + suffix.substring(0, neuterCut);
          }

          const feminineCut = suffix.indexOf('/');
          if (feminineCut >= 0) {
            if ([1,2].includes(declension)) {
              throw new Error(
                "Declension does not include both masculine and feminine words: " + declension
              );
            }
            if (builder.gender === Gender.FEMININE) {
              suffix = stem + suffix.substring(feminineCut + 1);
            } else {
              suffix = stem + suffix.substring(0, feminineCut);
            }
          }
        }

        const partitiveCut = suffix.indexOf('~');
        if (partitiveCut >= 0) {
          if (builder.partitive) {
            suffix = suffix.substring(0, partitiveCut);
          } else {
            suffix = suffix.substring(partitiveCut + 1);
          }
        }

        // Use Nominative if '1' at this point
        if (suffix.endsWith("1")) {
          suffix = nominative;
        }
        result.set(builder.build(), suffix);
      }
    }
    return result;
  }
  
  /**
   * Constructs the full genitive case from the nominative and the genitive
   * suffix.
   */
  static constructGenitive(nominative, genitiveSuffix) {
    let stem;
    if (isConsonant(genitiveSuffix.charAt(0))) {
      let i = nominative.length - 1;
      while (i >= 0 && nominative.charAt(i) != genitiveSuffix.charAt(0)) {
        i--;
      }
      if (i === 0) {
        throw new Error("Unable to split off nominative case suffix: '" + nominative + "'");
      }
      stem = nominative.substring(0, i);
    } else {
      stem = this.findStem(nominative);
    }
    return stem + genitiveSuffix;
  }

  // Todo: Do this, only if needed (it will be a lot of work) 
  // /**
  //  * Attempts to construct a noun from any declension and form.
  //  * Needed for Proper Nouns
  //  * 
  //  * @param {string} word - Valid Latin noun in any declension
  //  */
  static constructProperNounForms(word) {
    
  }
}
