import WordType from "../api/WordType";
import { ENGLISH_ARTICLES } from "./Translation";

export default function parseTranslation(rawText) {
  rawText.replace(/[^A-Za-z]/g, "").split(" ")
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
