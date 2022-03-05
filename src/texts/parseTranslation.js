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
    const isProperNoun = chunk.isProperNoun || properNouns.includes(latinText);

    let wordOptions = isProperNoun ? null : dictionary.find(latinTextLowercase);
    if (!wordOptions) {
      // Todo: Check that word isn't first of a sentence too
      if (isProperNoun || (index !== 0 && capitalized)) {
        // Assume it's a proper noun
        const genericNoun = new FormBuilder(WordType.NOUN).build();
        const properWord = new Word(latinText, genericNoun, latinText);
        let english = genericEnglishTranslation(properWord, chunk);
        english = applyPunctuation(english, chunk, latinSurroundingChars);
        translationChunks.push(
          new TranslationChunk(properWord, chunk, latinText, english, null, null)
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
    switch(wordWithGrammar.definition.type) {
      case WordType.PRONOUN:
        if (englishText === "i") {
          englishText = "I";
          // The only word like this, kind of interesting that it's of yourself
          // Does this accidentally contribute to egotism to native English speakers?
          break;
        }
      case WordType.NOUN:
      case WordType.ADJECTIVE:
        const nominativeForm = new FormBuilder(
          Case.NOMINATIVE,
          wordWithGrammar.form.plurality,
          wordWithGrammar.form.gender
        ).build();
        const nominative = wordWithGrammar.definition.getWord(nominativeForm);

        let article = chunk.article;
        if (!article) {
          const prevChunk = translationChunks[index - 1];
          const isPreviousAdjective = prevChunk?.definition &&
            prevChunk.definition.type === WordType.ADJECTIVE;
          if (!isPreviousAdjective) {
            article = defaultArticle(wordWithGrammar, nominative, allChunks, capitalized);
          }
        }
        const hasLatinCase = chunk.hasLatinCase ?? defaultHasLatinCase(wordWithGrammar, translationChunks);
        const preposition = hasLatinCase ? (chunk.preposition || defaultPreposition(wordWithGrammar)) : "";
        
        englishText = buildEnglishNoun(wordWithGrammar, chunk, nominative, article, preposition, capitalized);
        wordTypeData = { article, hasLatinCase, preposition };
        break;
      case WordType.VERB:
        const firstPersonPresentForm = new FormBuilder(
          Mood.INDICATIVE,
          Person.FIRST,
          Tense.PRESENT,
          Voice.ACTIVE,
          // Verb shouldn't be like this, but it do
          // Todo: Remove plurality from all non-ptcp translations. Conjugation ends up being "[verb] sumus" etc with plural
          wordWithGrammar.form.plurality
        ).build();
        const firstPersonPresent = wordWithGrammar.definition.getWord(firstPersonPresentForm);
        // Todo: Remove pronoun in imperative verb
        englishText = buildEnglishVerb(wordWithGrammar, chunk, firstPersonPresent, capitalized);
        break;
        // Todo: Adverbs
      default:
        englishText = buildEnglishMiscType(wordWithGrammar, chunk, capitalized);
    }
    englishText = applyPunctuation(englishText, chunk, latinSurroundingChars);

    const { pre = "", post = "" } = chunk;
    englishText = `${pre}${englishText}${post}`;

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

  console.log(`\n\n${fullText}\n\n`)
  console.log(translation.toEnglish());

  return translationChunks;
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
  const casedWord = capitalized ? capitalize(latinWordKey.word) : latinWordKey.word;
  const match = defaultTranslations[casedWord] || defaultTranslations[word];
  if (Array.isArray(match)) {
    return match[word.form.plurality === Plurality.PLURAL ? 1 : 0];
  }
  return match;
}

function buildEnglishNoun(word, chunk, nominative, article, preposition, capitalized) {
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
    if (capitalized && translation) {
      translation = capitalize(translation);
    }
  }
  
  out += translation;

  return out;
}

function buildEnglishVerb(word, chunk, firstPersonPresent, capitalized) {
  let translation = genericEnglishTranslation(word, chunk, firstPersonPresent);
  if (translation) {
    return translation;
  }
  if (!translation) {
    translation = guessTranslation(word);
  }
  if (capitalized && translation) {
    translation = capitalize(translation);
  }

  // Participle: A verb used as an adjective
  const { post = "", suffix = "" } = chunk;
  if (word.form.mood === Mood.PARTICIPLE) {
    if (suffix) {
      translation += suffix;
    } else {
      translation += "ed";
    }
    // Todo: Maybe this is overzealous
    if (post == null) {
      if (word.form.plurality === Plurality.SINGULAR) {
        translation += " is";
      } else {
        translation += " are";
      }
    }
  }
  return translation;
}

function buildEnglishMiscType(word, chunk, capitalized) {
  const english = genericEnglishTranslation(word, chunk) || guessTranslation(word);
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
