
export const VOWELS = "aeiouAEIOU";
export const CONSONANTS = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";

export function isConsonant(char) {
  return CONSONANTS.indexOf(char) !== -1;
}

export function isVowel(char) {
  return VOWELS.indexOf(char) !== -1;
}

/**
 * Checks whether all characters in s are consonants.
 */
 export function consonantsOnly(string) {
  for (let i = 0; i < string.length; i++) {
    if (CONSONANTS.indexOf(string.charAt(i)) === -1) {
      return false;
    }
  }
  return true;
}
