import parseDefinition from "./processors/parseDefinition.js";

/*
 * Build map of Dictionary instances keyed by Latin (text) word.
 * Input is a list of line-breaked set of definitions.
 * All word inflections are included in the map.
 */
export default class Dictionary {
  constructor(rawText) {
    this.dictionary = new Map();

    const lines = rawText.split("\n");
    const rawDefinitions = lines.reduce((accumulator, current) => {
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
        const definition = parseDefinition(line);
        if (definition == null) {
          return;
        }
        for (let entry of definition.forms) {
          const word = entry[1];
          const string = word.word;
          // let words = null;
          // if (definition.type === WordType.PRONOUN) {
          //   this.dictionary.get(string);
          // } else {
          //   words = this.dictionary.get(string);
          // }
          let words = this.dictionary.get(string);
          if (words == null) {
            words = new Set();
            this.dictionary.set(string, words);
          }
          words.add(word);
        }
      } catch (err) {
        errors++;
        if (process.argv && process.argv.includes("debug")) {
          console.error("\n\nError processing '" + line + "': " + err + "\n");
          console.error(err.stack);
        }
      }  
    });
    console.error("\nCount: " + rawDefinitions.length + "\nErrors: " + errors + "\nSuccessful: " + (rawDefinitions.length - errors));
  }

  find(word) {
    return this.dictionary.get(word);
  }
}
