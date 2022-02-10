import Case from "../api/Case.js";
import Definition from "../api/Definition.js";
import Gender from "../api/Gender.js";
import Plurality from "../api/Plurality.js";
import WordType from "../api/WordType.js";
import Conjugation from "./Conjugation.js";
import conjugate from "./Conjugator.js";
import Declinator from "./Declinator.js";

export default class Latin {
  static VOCALS = "aeiouAEIOU";
  static CONSONANTS = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";

  static CASES = Object.values(Case);

  static PLURALITY = Object.values(Plurality);

  static GENERA = Object.values(Gender);

  static isConsonant(char) {
    return this.CONSONANTS.indexOf(char) !== -1;
  }

  static isVocal(char) {
    return this.VOCALS.indexOf(char) !== -1;
  }

  /**
   * Checks whether all characters in s are consonants.
   */
  static consonantsOnly(string) {
    for (let i = 0; i < string.length; i++) {
      if (this.CONSONANTS.indexOf(string.charAt(i)) === -1) {
        return false;
      }
    }
    return true;
  }

  static findStem(nominative) {
    const length = nominative.length;
    if (this.isVocal(nominative.charAt(length - 1))) {
      return nominative.substring(0, length - 1);
    }
    return nominative.substring(0, length - 2);
  }

  static syllableCount(string) {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      if (this.VOCALS.indexOf(string.charAt(i)) > -1) {
        count++;
      }
    }
    return count;
  }

  constructor(rawText) {
    this.dictionary = new Map();

    // TODO: Use Stream if .txt file is still used
    const lines = rawText.split("\n");
    const rawDefinitions = lines.reduce((accumulator, current, index) => {
      // A definition
      if (current.startsWith(" ")) {
        accumulator[accumulator.length - 1] += ` ${current.trim()}`
      // The main line
      } else {
        accumulator.push(current);
      }
      return accumulator;
    }, [])

    let errors = 0;
		
    rawDefinitions.forEach(rawLine => {
      let line = rawLine.trim();
      try {
        const definition = this.parseDefinition(line);
        if (definition == null) {
          return;
        }
        for (let entry of definition.forms) {
          const word = entry[1];
          const string = word.word;
          let words = this.dictionary.get(string);
          if (words == null) {
            words = new Set();
            this.dictionary.set(string, words);
          }
          words.add(word);
        }
      } catch (err) {
        errors++;
        console.error("\n\nError processing '" + line + "': " + err + "\n");
        console.error(err.stack);
      }  
    });
    console.error("\nCount: " + rawDefinitions.length + "\nErrors: " + errors + "\nSuccessful: " + (rawDefinitions.length - errors));
  }

  parseDefinition(def) {
    def = def.toLowerCase();
    const colon = def.indexOf(":");
    if (colon === -1) {
      throw new Error(": expected.\nDef: " + def);
    }
    
    const leftParts = def.substring(0, colon).split(";");
    const wordParts = leftParts[0].trim().split(", ");
    const typeParts = leftParts[1].trim().split(" ");
    /*    
      TODO: (Looks like something unfinished from Java project)

      String[] metaParts = leftParts.length > 2 ? leftParts[2].split(",") : new String[0];
      Skip infrequent
        for (String meta: metaParts) {
    
          meta = meta.trim();
          if (meta.startsWith("frq:") && meta.indexOf("-") !== -1) {
            return null;
          }
        }
    */
    
    for (let i = 0; i < wordParts.length; i++) {
      let word = wordParts[i].trim();
      if (word.endsWith("(i)") || word.endsWith("(ii)")) {
        word = word.substring(0, word.indexOf('(')) + 'i';
      }
      wordParts[i] = word;
    }
    
    const wordTypeName = typeParts[0];
    let type = null;
    for (let t of Object.values(WordType)) {
      if (t.toString() === wordTypeName.toUpperCase()) {
        type = t;
        break;
      }
    }
    if (type == null) {
      throw new Error("Unrecognized word type: " + wordTypeName);
    }

    const definition = new Definition(type, def.substring(colon + 2).trim());
    switch (type) {
      case WordType.NOUN:
        return this.processNoun(definition, wordParts, typeParts);
      case WordType.VERB:
        return this.processVerb(definition, wordParts, typeParts);
      case WordType.ADJECTIVE:
        return definition.addForms(Declinator.declineAdjective(wordParts));
      default:
        return definition.addFormless(wordParts[0]);
    }
  }

  /**
   * All forms of a noun
   */
  processNoun(definition, words, kinds) {
    switch (kinds[kinds.length - 1].toUpperCase().trim()) {
      case "F":
        definition.genus = Gender.FEMININE;
        break;
      case "C":
      case "M":
        definition.genus = Gender.MASCULINE;
        break;
      case "N":
        definition.genus = Gender.NEUTER;
        break;
      default:
        throw new Error("Unrecognized genus '" + kinds[kinds.length - 1] + "'");
    }
    if (words.length !== 2) {
      throw new Error("Nominative and genitive expected for noun entries. Got: " + words.join(", "));
    }
    const declinedNoun = Declinator.declineNoun(definition.genus, words[0], words[1]);
    return definition.addForms(declinedNoun);
  }

  /**
   * All forms of a verb
   */
  processVerb(definition, words, kinds) {
    let conjugationDescription = kinds.length > 1 ? kinds[1] : "0";
    if (conjugationDescription.startsWith("(")) {
      conjugationDescription = conjugationDescription.substring(1, 2);
    }
    const hasConjugation = (
      conjugationDescription.length === 1 &&
      conjugationDescription.charAt(0) >= '1' &&
      conjugationDescription.charAt(0) <= '4'
    ) 
    const conjugation = hasConjugation ? parseInt(conjugationDescription) : 0;
    return definition.addForms(conjugate(words[0], words[1], words[2], words[3], conjugation));
  }

  find(word) {
    return this.dictionary.get(word);
  }
}
