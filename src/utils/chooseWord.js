import Word from "../api/Word.js";

/*
 * Picks the best [Definition, Form] entry to use out of many, based on a few criteria:
 * - Manually-set wordType and case
 * - Frequency according to Whitaker's Words
 * - Naive guess of noun declension based on surrounding words
 */
export function chooseWordEntry(words, sentence, { manualWordType, manualCase } = {}) {
  // Todo: move this into a util as well
  const defs = Word.formsByDefinition(words);
  
  manualWordType &&= manualWordType.toUpperCase();
  manualCase &&= manualCase.toUpperCase();
  
  const candidates = [];

  // Selects the first def that meets criteria for now
  for (let [definition, forms] of defs) {
    let form = forms[0];
    // Archaic or Modern
    if (definition.codes.ageRank === 1 || definition.codes.ageRank > 6) {
      continue;
    }
    if (manualWordType && definition.type !== manualWordType) {
      continue;
    }
    if (manualCase) {
      form = forms.find(form => form.casus === manualCase);
      if (!form) {
        continue;
      }
    }
    
    candidates.push({ definition, form });
  }
  if (candidates.length) {
    return candidates.sort((c1, c2) => (
      compareFrequency(c1, c2)
    ))[0];
  }
  return null;
}

/*
 * V2 of the above, returns Word instead and is to be used by parseTranslation
 * - Explicit Form attribute in translationChunk
 * - Frequency according to Whitaker's Words
 * - Naive guess of noun declension based on surrounding words (TODO)
 */
export function chooseWord(words, sentence, translationChunk = {}) {
  let { wordType, wordCase } = translationChunk;

  // Todo: move this into a util as well
  const defs = Word.formsByDefinition(words);  
  wordType &&= wordType.toUpperCase();
  wordCase &&= wordCase.toUpperCase();
  
  const candidates = [];

  // Selects the first def that meets criteria for now
  for (let [definition, forms] of defs) {
    let form = forms[0];
    // Archaic or Modern
    if (definition.codes.ageRank === 1 || definition.codes.ageRank > 6) {
      continue;
    }
    if (wordType && definition.type !== wordType) {
      continue;
    }
    if (wordCase) {
      form = forms.find(form => form.casus === wordCase);
      if (!form) {
        continue;
      }
    }
    
    candidates.push({ definition, form });
  }
  if (candidates.length) {
    const topCandidate = candidates.sort((c1, c2) => (
      compareFrequency(c1, c2)
    ))[0];
    let chosen = null;
    for (let word of words) {
      if (word.form.equals(topCandidate.form)) {
        chosen = word;
        break;
      }
    };
    if (!chosen) {
      throw new Error("Couldn't match word after form and definition were chosen?", { form, definition })
    }
    return chosen;
  }
  return null;
}


const compareFrequency = (e1, e2) => (
  e2.definition.codes.frequency - e1.definition.codes.frequency
);
