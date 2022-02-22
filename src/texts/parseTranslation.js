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
    const wordText = chunk.latin.replace(/[^A-Za-z\s]/, "").toLowerCase();
    const wordOptions = dictionary.find(wordText);
    if (!wordOptions) {
      throw new Error("Couldn't find word in dictionary: " + wordText);
    }
    const word = chooseWord(wordOptions, fullText, chunk);
    return new TranslationChunk(word, wordText, wordOptions);
  });
  console.log(JSON.stringify(fullWords))
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
