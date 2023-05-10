

export const personNominativePronouns = {
	SG: {
    "1.": "I",
    "2.": "you",
    "3.": {
      M: "he",
      F: "she",
      N: "it"
    }
  },
  PL: {
    "1.": "we",
    "2.": "you",
    "3.": {
      M: "they",
      F: "they",
      N: "they"
    }
  }
};

export const personAblativePronouns = {
	SG: {
    "1.": "me",
    "2.": "you",
    "3.": {
      M: "him",
      F: "her",
      N: "it"
    }
  },
  PL: {
    "1.": "us",
    "2.": "you",
    "3.": {
      M: "them",
      F: "them",
      N: "them"
    }
  }
};

export const personPossessivePronouns = {
	SG: {
    "1.": "my",
    "2.": "your",
    "3.": {
      M: "his",
      F: "her",
      N: "its"
    }
  },
  PL: {
    "1.": "our",
    "2.": "your",
    "3.": {
      M: "there",
      F: "there",
      N: "there"
    }
  }
};

export const formPronouns = {
  NOM: personNominativePronouns,
  ABL: personAblativePronouns,
  POSS: personPossessivePronouns
}

// Add aliases for '1.' etc here
