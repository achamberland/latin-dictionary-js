import WordType from "../api/WordType.js";
import { chooseWord } from "../utils/chooseWord.js";
import Translation, { ENGLISH_ARTICLES } from "./Translation.js";
import TranslationChunk from "./TranslationChunk.js";

export default function parseTranslation(name, rawText, dictionary) {
  let json = null;
  try {
    json = JSON.parse(rawText);
  } catch(e) {
    throw new Error("Invalid JSON for translation: " + name, e);
  }

  const allLatins = json.chunks.map(chunk => chunk.latin);
  const fullText = allLatins.join(" ") + ".";

  const fullWords = json.chunks.map(chunk => {
    const latinText = chunk.latin.replace(/[^A-Za-z\s]/, "").toLowerCase();
    const wordOptions = dictionary.find(latinText);
    if (!wordOptions) {
      throw new Error("Couldn't find word in dictionary: " + latinText);
    }
    const word = chooseWord(wordOptions, fullText, chunk);
    if (!word) {
      throw new Error("Couldn't choose best word for word: " + latinText);
    }

    let englishText = "";
    // Todo: Make this a class maybe
    let wordTypeData = {};

    if (word.definition.type === WordType.NOUN) {
      const article = chunk.article || defaultArticle(word);
      const hasLatinCase = chunk.hasLatinCase || defaultHasLatinCase(word, rawText);
      const preposition = hasLatinCase ? (chunk.preposition || defaultPreposition) : "";
      englishText = buildEnglishNoun(word, chunk, article, preposition);
      wordTypeData = { article, hasLatinCase, preposition };
    } else {
      englishText = chunk.english || word.definition;
    }

    return new TranslationChunk(word, latinText, englishText, wordTypeData, wordOptions);
  });

  console.log(fullWords.map(w => JSON.stringify(w.word)));

  return fullWords;
}

function defaultArticle(word) {
  if (word.form.wordType !== WordType.NOUN) {
    return ENGLISH_ARTICLES[0];
  }
  if (text.charAt(0).isUpperCase()) {
    return ENGLISH_ARTICLES[2];
  }
  return ENGLISH_ARTICLES[1];
}

// Roughly detect if word already has case preposition in Latin
function defaultHasLatinCase(word, sentence) {
  const casedTypes = [WordType.NOUN, WordType.ADJECTIVE, WordType.PRONOUN];
  if (!casedTypes.includes(word.form.wordType)) {
    return false;
  }
  const prevTypes = sentence.substring(0, sentence.indexOf(word.word)).map(prevWord => (
    prevWord.form.wordType
  ));
  const lastPrepositionIndex = prevTypes.length - prevTypes.reverse().indexOf(WordType.PREPOSITION);
  const betweenWords = prevTypes.slice(lastPrepositionIndex);
  return betweenWords.every(wordType => casedTypes.includes(wordType));
}

function buildEnglishNoun(word, chunk, article, preposition) {
  let out = "";
  out += article ? article + " " : "";
  out += preposition ? preposition + " " : "";

  // Todo: Definitions are not synonyms... data isn't in WW... this is bad
  out += chunk.english || word.definition;

  return out;
}
