import Word from "../api/Word.js";

/*
 * Picks the best [Definition, Form] entry to use out of many, based on a few criteria:
 * - Manually-set wordType and case
 * - Frequency according to Whitaker's Words
 * - Naive guess of noun declension based on surrounding words
 */
export default function chooseWordEntry(words, sentence, { manualWordType, manualCase } = {}) {
  // Todo: move this into a util as well
  const defs = Word.formsByDefinition(words);
  
  manualWordType &&= manualWordType.toUpperCase();
  manualCase &&= manualCase.toUpperCase();
  
  // Selects the first def that meets criteria for now
  for (let [def, forms] of defs) {
    let form = forms[0];
    if (manualWordType && def.type !== manualWordType) {
      continue;
    }
    if (manualCase) {
      form = forms.find(form => form.casus === manualCase);
      if (!form) {
        continue;
      }
    }
    return { def, form };
  }
  return null;
}