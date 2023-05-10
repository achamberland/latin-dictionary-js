import Codes from "../models/Codes.js";
import Definition from "../models/Definition.js";
import Gender from "../constants/Gender.js";
import WordType from "../constants/WordType.js";
import conjugate from "../processors/inflection/Conjugator.js";
import Declinator from "../processors/inflection/Declinator.js";

/*
 * From one text-based definition:
 * 1) Create a Definition instance and fill with the root Word and defintition text
 * 2) Build all possible Forms of the root word
 */
export default function parseDefinition(def) {
  def = def.toLowerCase();
  const colon = def.indexOf(":");
  if (colon === -1) {
    throw new Error(": expected.\nDef: " + def);
  }
  
  const leftParts = def.substring(0, colon).split(";");
  const wordParts = leftParts[0].trim().split(", ");
  const typeParts = leftParts[1].trim().split(" ");
  const codeParts = leftParts[2].trim().split(", ");
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

  codeParts.push(codeParts.pop().replace(";", ""));
  const age = parseCode(codeParts, Codes.CODE_AGE);
  const frequency = parseFrequency(codeParts);
  const source = parseCode(codeParts, Codes.CODE_SOURCE);
  const codes = new Codes(age, frequency, source);

  const definition = new Definition(type, def.substring(colon + 2).trim(), codes);
  switch (type) {
    case WordType.NOUN:
    case WordType.PRONOUN:
      return processNoun(definition, wordParts, typeParts);
    case WordType.VERB:
      return processVerb(definition, wordParts, typeParts);
    case WordType.ADJECTIVE:
      return definition.addForms(Declinator.declineAdjective(wordParts));
    // case WordType.PRONOUN:
      // return definition.addForms(processPronoun(definition, wordParts, typeParts));
    default:
      return definition.addFormless(wordParts[0]);
  }
}

/**
 * All forms of a noun
 */
function processNoun(definition, words, kinds) {
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
    case "PERS":
    case "PRON":
      break;
    default:
      throw new Error("Unrecognized genus '" + kinds[kinds.length - 1] + "'");
  }
  if (words.length !== 2) {
    throw new Error("Nominative and genitive expected for noun entries. Got: " + words.join(", "));
  }
  let declined = null;
  if (definition.type === WordType.PRONOUN) {
    declined = Declinator.declinePronoun(definition.genus, words[0], words[1]);
  } else {
    declined = Declinator.declineNoun(definition.genus, words[0], words[1]);
  }
  return definition.addForms(declined);
}

/**
 * All forms of a verb
 */
function processVerb(definition, words, kinds) {
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

// processPronoun(definition, words, kinds) {
//   if () {
//     return processNoun(definition, words, kinds);
//   }
//   const pronoun = parsePronoun(words[0]);
//   switch (kinds[kinds.length - 1].toUpperCase().trim()) {
//     case "F":
//       definition.genus = Gender.FEMININE;
//       break;
//     case "C":
//     case "M":
//       definition.genus = Gender.MASCULINE;
//       break;
//     case "N":
//       definition.genus = Gender.NEUTER;
//       break;
//     default:
//       throw new Error("Unrecognized genus '" + kinds[kinds.length - 1] + "'");
//   }
//   if (words.length !== 2) {
//     throw new Error("Nominative and genitive expected for noun entries. Got: " + words.join(", "));
//   }
//   const declinedNoun = Declinator.declineNoun(definition.genus, words[0], words[1]);
//   return definition.addForms(declinedNoun);
// }

function parseCode(codes, codeKey) {
  const rawCode = codes.find(code => code.startsWith(codeKey));
  if (rawCode) {
    return rawCode.substring(codeKey.length);
  }
  return null;
}

function parseFrequency(codes) {
  const frequencyValue = parseCode(codes, Codes.CODE_FREQUENCY);
  if (frequencyValue) {
    let middle = 4;
    const pluses = frequencyValue.split("+");
    if (pluses.length) {
      return middle + pluses.length - 1;
    }
    return middle - frequencyValue.split("-").length; 
  }
  return null;
}

// Todo: Do this only if needed (it will be a lot of work) 
// createProperNounDefinition(word) {
//   const definition = new Definition("N", word);
//   const lastTwoLetters = word.slice(word.length - 2).includes("u");
//   let inferredType = "N"
//   // Todo: Handle Neuter, and pick up other edge cases 
//   if (lastTwoLetters.includes("u")) {
//     inferredType = "M"
//   } else if (lastTwoLetters.includes("a")) {
//     inferredType = "F"
//   }
//   const [nominative, genitive] = Declinator.constructProperNounForms(word);
//   // processNoun(definition, [word, inferredGenitive], [inferredType])
// }
