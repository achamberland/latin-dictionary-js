import Case from "../api/Case.js";
import FormBuilder from "../api/FormBuilder.js";
import Latin from "../latin/Latin.js";
import Mood from "../api/Mood.js";
import Person from "../api/Person.js";
import Plurality from "../api/Plurality.js";
import { capitalize } from "../api/Strings.js";
import Tense from "../api/Tense.js";
import Voice from "../api/Voice.js";
import Word from "../api/Word.js";
import WordType from "../api/WordType.js";
import { chooseWord } from "../utils/chooseWord.js";
import defaultTranslations from "./constants/defaultTranslations.js";
import properNouns from "./constants/properNouns.js";
import Translation, { ENGLISH_ARTICLES } from "./Translation.js";
import TranslationChunk from "./TranslationChunk.js";

let declinatorInstance = null;

export default function parseTranslationList(rawText, dictionary) {
  let translationList = null;
  let name = null;
  try {
    const json = JSON.parse(rawText);
    translationList = json.translations;
  } catch(e) {
    throw new Error("Invalid JSON");
  }
  return translationList.map(translationJson => (
    parseTranslation(name, translationJson, dictionary)
  ));
}

function parseTranslation(name, translationJson, dictionary) {
  const allLatins = translationJson.chunks.map(chunk => chunk.latin);
  const fullText = allLatins.join(" ");
  
  const translationChunks = [];

  translationJson.chunks.forEach((chunk, index, allChunks)  => {
    const capitalized = !!chunk.latin.match(/^[A-Z]/);
    const latinText = chunk.latin.replace(/[^A-Za-z\s]/, "");
    const latinTextLowercase = latinText.toLowerCase();
    const latinSurroundingChars = chunk.latin.match(/([^A-Za-z0-9]*)[\w\s]+([^A-Za-z0-9]*)/);
    let isProperNoun = chunk.isProperNoun || properNouns.includes(latinText);
    
    // Array of functions
    // Expected function args:
    //  - Running english translation in progress
    //  - Chunk
    //  - All chunks
    //  - Translation class instance
    const englishTransforms = [];

    let wordOptions = null;
    if (!isProperNoun) {
      wordOptions = dictionary.find(latinTextLowercase);
    }
    if (!wordOptions) {
      // This is more accurate to be sure it's a proper noun, but its useless 
      //
      // const prevChunk = allChunks[index - 1];
      // isProperNoun = capitalized && (
        // index !== 0 && !prevChunk.latin.endsWith(".")
      // )

      // Todo: Check that word isn't first of a sentence too 
      if (isProperNoun || (index !== 0 && capitalized)) {
        // Assume it's a proper noun
        const genericNoun = new FormBuilder(WordType.NOUN).build();
        const properWord = new Word(latinText, genericNoun, latinText);
        const englishRoot = genericEnglishTranslation(properWord, chunk);
        englishTransforms.push(english => applyPunctuation(english, chunk, latinSurroundingChars));
        translationChunks.push(
          new TranslationChunk(properWord, chunk, latinText, englishRoot, englishTransforms, null, true)
        );
        return;
      } else {
        throw new Error("Couldn't find word in dictionary: " + latinText);
      }
    }
    const word = chooseWord(wordOptions, fullText, chunk);
    if (!word) {
      throw new Error("Couldn't choose best word for word: " + latinText);
    }
    const wordWithGrammar = new Word(latinText, word.form, word.definition);

    let englishText = "";
    // Todo: Make this a class maybe
    switch(wordWithGrammar.definition.type) {
      case WordType.PRONOUN:
        if (englishText === "i") {
          englishText = "I"
          // The only word like this, kind of interesting that it's of yourself
          // Does this accidentally contribute to egotism to native English speakers?
          break;
        }
      case WordType.NOUN:
      case WordType.ADJECTIVE:
        const nominative = wordWithGrammar.rootWord;

        if (capitalized) {
          englishTransforms.push(english => capitalize(english));
        }

        englishTransforms.push(function addArticle(english) {
          let article = chunk.article;
          if (!article) {
            const prevChunk = translationChunks[index - 1];
            const isPreviousAdjective = prevChunk?.definition &&
              prevChunk.definition.type === WordType.ADJECTIVE;
            if (!isPreviousAdjective) {
              article = defaultArticle(wordWithGrammar, nominative, allChunks, capitalized);
            }
          }
          return article ? `${article} ${english}` : english;
        });

        englishTransforms.push(function addPreposition(english, chunk, allChunks) {
          const hasLatinCase = chunk.hasLatinCase ?? defaultHasLatinCase(wordWithGrammar, chunk, allChunks);
          if (hasLatinCase) {
            const preposition = chunk.preposition || defaultPreposition(wordWithGrammar);
            if (preposition) {
              return `${preposition} ${english}`;
            }
          }
          return english;
        });

        englishText = buildEnglishMiscType(wordWithGrammar, chunk, capitalized, nominative);
        break;
      case WordType.VERB:
        const firstPersonPresent = wordWithGrammar.rootWord;
        // Todo: Remove pronoun in imperative verb
        englishText = buildEnglishMiscType(wordWithGrammar, chunk, capitalized, firstPersonPresent);
        englishTransforms.concat(buildEnglishVerbTransforms(word, chunk, capitalized));
        break;
        // Todo: Adverbs
      default:
        englishText = buildEnglishMiscType(wordWithGrammar, chunk, capitalized);
    }

    // Set order here


    englishTransforms.push(english => applyPunctuation(english, chunk, latinSurroundingChars));

    const { pre = "", post = "" } = chunk;
    englishTransforms.push(english => `${pre}${english}${post}`);

    translationChunks.push(
      new TranslationChunk(wordWithGrammar, chunk, latinText, englishText, englishTransforms, wordOptions)
    );
  });

  // Reorder words
  // 
  // Rules: 
  // Adjectives go first: gratia plena [N ADJ] -> full with grace [ADJ N]
  // Adverbs go first: ? [V ADV] -> ? [ADV V]
  // Subject-verb-object: [SOV] -> [SVO]
  // Verb-Subject-Object: Sanctificaetur nomen tuum -> Sanctificetur tuum nomen
  // Genitives after modifyee: 

  console.log(translationChunks.map(w => JSON.stringify(w.word)));

  const translation = new Translation(name, translationChunks, translationJson);

  console.log(`\n\n${fullText}\n\n`)
  console.log(translation.toEnglish());

  return translation;
}

function defaultArticle(word, dictionaryMatch = null, capitalized = false) {
  if (word.definition.type !== WordType.NOUN) return ENGLISH_ARTICLES[0];

  // If no match it's likely a proper noun, don't add article
  if (!dictionaryMatch) return ENGLISH_ARTICLES[0];

  // Ignore certain Cases
  if (![Case.NOMINATIVE, Case.ACCUSATIVE, Case.ABLATIVE, Case.DATIVE].includes(word.form.casus)) {
    return ENGLISH_ARTICLES[0];
  }
  // The
  if (capitalized) {
    return ENGLISH_ARTICLES[1];
  }
  // A and An
  if (word.form.plurality === Plurality.PLURAL) {
    return ENGLISH_ARTICLES[0];
  }
  if (Latin.VOCALS.includes(word.word.charAt(0))) {
    return ENGLISH_ARTICLES[3];
  }
  return ENGLISH_ARTICLES[2];
}

// Roughly detect if word already has case preposition in Latin
function defaultHasLatinCase(word, chunk, allChunks) {
  const casedTypes = [WordType.NOUN, WordType.ADJECTIVE, WordType.PRONOUN];
  if (!casedTypes.includes(word.definition.type)) {
    return false;
  }
  
  const prevWordIndex = allChunks.indexOf(chunk);
  if (prevWordIndex >= 0) {
    const prevWord = allChunks[prevWordIndex];
    return prevWord.definition.type !== WordType.PREPOSITION;
  }
  return false;
}

function defaultPreposition(word) {
  switch (word.form.casus) {
    case Case.GENITIVE:
      return "of";
    case Case.GENITIVE:
      return "to";
    case Case.ABLATIVE:
      return "in";
    case Case.NOMINATIVE:
    case Case.ACCUSATIVE:
    case Case.VOCATIVE:
      return "";
  }
}

function defaultTranslation(word, rootWord = null, capitalized = false) {
  const latinWordKey = rootWord || word;
  const casedWord = capitalized ? capitalize(latinWordKey.word) : latinWordKey.word;
  const match = defaultTranslations[casedWord] || defaultTranslations[word];
  if (Array.isArray(match)) {
    return match[word.form.plurality === Plurality.PLURAL ? 1 : 0];
  }
  return match;
}

function buildEnglishNoun(word, chunk, nominative, article, preposition) {
  let out = "";
  out += preposition ? preposition + " " : "";
  out += article ? article + " " : "";

  // Todo: Definitions are not synonyms... data isn't in WW... this is bad
  let translation = chunk.english;
  if (!translation) {
    translation = genericEnglishTranslation(word, chunk, nominative);
    if (!translation) {
      translation = guessTranslation(word);
    }
  }
  
  out += translation;

  return out;
}

function buildEnglishVerbTransforms(word, chunk, capitalized) {
  const transforms = [];
  if (capitalized) {
    transforms.push(english => capitalize(english));
  }

  // Participle: A verb used as an adjective
  const { post = "", suffix = "" } = chunk;
  if (word.form.mood === Mood.PARTICIPLE) {
    transforms.push(function addSuffix(english) {
      if (suffix) {
        return english + suffix;
      } else {
        return english + "ed";
      }
    });
    // Todo: Maybe this is overzealous
    if (post == null) {
      transforms.push(function addPostVerb(english) {
        if (word.form.plurality === Plurality.SINGULAR) {
          return english + " is";
        } else {
          return english + " are";
        }
      });
    }
  }
  return transforms;
}

function buildEnglishMiscType(word, chunk, capitalized, rootWord = null) {
  const english = genericEnglishTranslation(word, chunk, rootWord) || guessTranslation(word);
  if (capitalized && english) {
    return capitalize(english);
  }
  return english;
}

function genericEnglishTranslation(word, chunk, rootWord = null) {
  return chunk.english || defaultTranslation(word, rootWord, !!word.word.charAt(0).match(/[^A-Z]/));
}

function guessTranslation(word) {
  const firstWordMatch = word.definition.description.match(/(^\w+)([,;\n]|\s\s)/);
  return (firstWordMatch && firstWordMatch[1]) ||
    word.definition.description.substring(0, word.definition.description.indexOf(";"));
}

function applyPunctuation(word, chunk, latinSurroundingChars) {
  if (!chunk.english) {
    if (latinSurroundingChars[1]) {
      return latinSurroundingChars[1] + word;
    }
    if (latinSurroundingChars[2]) {
      return word + latinSurroundingChars[2];
    }
  }
  return word;
}
