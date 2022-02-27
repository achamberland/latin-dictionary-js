import Case from "../api/Case.js";
import FormBuilder from "../api/FormBuilder.js";
import Mood from "../api/Mood.js";
import Plurality from "../api/Plurality.js";
import Word from "../api/Word.js";
import WordType from "../api/WordType.js";
import { chooseWord } from "../utils/chooseWord.js";
import defaultTranslations from "./constants/defaultTranslations.js";
import properNouns from "./constants/properNouns.js";
import Translation, { ENGLISH_ARTICLES } from "./Translation.js";
import TranslationChunk from "./TranslationChunk.js";

let declinatorInstance = null;

export default function parseTranslationList(name, rawText, dictionary) {
  let translationList = null;
  try {
    const json = JSON.parse(rawText);
    translationList = json.translations;
  } catch(e) {
    throw new Error("Invalid JSON for translation: " + name, e);
  }
  return translationList.map(translationJson => (
    parseTranslation(name, translationJson, dictionary)
  ));
}

function parseTranslation(name, translationJson, dictionary) {
  const allLatins = translationJson.chunks.map(chunk => chunk.latin);
  const fullText = allLatins.join(" ") + ".";
  
  const translationChunks = [];

  translationJson.chunks.forEach((chunk, index)  => {
    const capitalized = !!chunk.latin.match(/^[A-Z]/);
    const latinText = chunk.latin.replace(/[^A-Za-z\s]/, "");
    const latinTextLowercase = latinText.toLowerCase();
    const isProperNoun = chunk.isProperNoun || properNouns.includes(latinText);

    let wordOptions = isProperNoun ? null : dictionary.find(latinTextLowercase);
    if (!wordOptions) {
      // Todo: Check that word isn't first of a sentence too
      if (isProperNoun || (index !== 0 && capitalized)) {
        // Assume it's a proper noun
        const properWord = new Word(latinText, FormBuilder.EMPTY, latinText);
        const english = genericEnglishTranslation(properWord, chunk);
        translationChunks.push(
          new TranslationChunk(properWord, chunk, latinText, chunk.english, null, null)
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
    let wordTypeData = {};

    if (wordWithGrammar.definition.type === WordType.NOUN) {
      const nominativeForm = new FormBuilder(
        Case.NOMINATIVE,
        wordWithGrammar.form.plurality,
        wordWithGrammar.form.gender
      ).build();
      const nominative = wordWithGrammar.definition.getWord(nominativeForm);

      const article = chunk.article ?? defaultArticle(wordWithGrammar, nominative, capitalized);
      const hasLatinCase = chunk.hasLatinCase ?? defaultHasLatinCase(wordWithGrammar, translationChunks);
      const preposition = hasLatinCase ? (chunk.preposition || defaultPreposition(wordWithGrammar)) : "";
      englishText = buildEnglishNoun(wordWithGrammar, chunk, nominative, article, preposition);
      wordTypeData = { article, hasLatinCase, preposition };
    } else if (wordWithGrammar.definition.type === WordType.VERB) {
      // Remove pronoun in imperative verb
      englishText = buildEnglishVerb(wordWithGrammar, chunk);
    } else {
      englishText = buildEnglishMiscType(wordWithGrammar, chunk);
    }
    englishText = englishText || chunk.english || wordWithGrammar.definition.description;

    translationChunks.push(
      new TranslationChunk(wordWithGrammar, chunk, latinText, englishText, wordTypeData, wordOptions)
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

  console.log(translation.toEnglish());

  return translationChunks;
}

function defaultArticle(word, dictionaryMatch = null, capitalized = false) {
  if (word.definition.type !== WordType.NOUN) return ENGLISH_ARTICLES[0];

  // If no match it's likely a proper noun, don't add article
  if (!dictionaryMatch) return ENGLISH_ARTICLES[0];

  // Is it the right Case?
  if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(word.form.casus)) return ENGLISH_ARTICLES[0];

  if (capitalized) {
    return ENGLISH_ARTICLES[2];
  }
  return ENGLISH_ARTICLES[1];
}

// Roughly detect if word already has case preposition in Latin
function defaultHasLatinCase(word, priorWords) {
  const casedTypes = [WordType.NOUN, WordType.ADJECTIVE, WordType.PRONOUN];
  if (!casedTypes.includes(word.definition.type)) {
    return false;
  }

  // Checks if prev word is a preposition already
  return priorWords.length === 0 ||
    priorWords[priorWords.length - 1].definition.type !== WordType.PREPOSITION;
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
  const casedWord = capitalized ?
    latinWordKey.word.charAt(0).toUpperCase() + latinWordKey.word.slice(1) :
    latinWordKey.word;

  return defaultTranslations[casedWord] || defaultTranslations[word];
}

function buildEnglishNoun(word, chunk, nominative, article, preposition) {
  let out = "";
  out += preposition ? preposition + " " : "";
  out += article ? article + " " : "";

  // Todo: Definitions are not synonyms... data isn't in WW... this is bad
  let translation = chunk.english;
  if (!translation) {
    translation = genericEnglishTranslation(word, chunk, nominative);
  }
  if (!translation) {
    translation = guessTranslation(word);
  }
  
  out += translation;

  return out;
}

function buildEnglishVerb(word, chunk) {
  let translation = genericEnglishTranslation(word, chunk);
  if (translation) {
    return translation;
  }
  if (!translation) {
    translation = guessTranslation(word);
  }

  // Participle: A verb used as an adjective
  if (word.form.mood === Mood.PARTICIPLE) {
    translation += "ed";
  }
  return translation;
}

function buildEnglishMiscType(word, chunk) {
  return genericEnglishTranslation(word, chunk) || guessTranslation(word);
}

function genericEnglishTranslation(word, chunk, rootWord = null) {
  return chunk.english || defaultTranslation(word, rootWord, !!word.word.charAt(0).match(/[^A-Z]/));
}

function guessTranslation(word) {
  const firstWordMatch = word.definition.description.match(/(^\w+)([,;\n]|\s\s)/);
  return (firstWordMatch && firstWordMatch[1]) || word.definition.description;
}
