
// Conjugate/Declinate a single word as if loaded by Latin.js initializer

import Latin from "./latin/Latin.js";

// Debug functions to use directly by node execution files
export function compileWord(word, rawText) {
  const matches = rawText.split("\n").filter(textLine =>
    textLine.startsWith(word) || textLine.includes(`, ${word}`)
  );
  let match;
  if (matches.length > 1) {
    // Use more accurate but less efficient regex to narrow down

    // Couldn't get it all into one regexp quickly {:(
    const firstRegexp = new RegExp(`^${word}(,|;)`);
    const subsequentRegexp = new RegExp(`^.+, ${word}(,|;) `);
    match = matches.find(word =>
      word.match(firstRegexp) || word.match(subsequentRegexp)
    );
  } else {
    match = matches[0];
  }
  if (!match) {
    console.log(`No matches for word '${word}'`);
    return;
  }

  const { dictionary } = new Latin(match);
  Array.from(dictionary).forEach(([string, words]) => {
    console.log(`${string}\n`, JSON.stringify(Array.from(words)))
  });
}