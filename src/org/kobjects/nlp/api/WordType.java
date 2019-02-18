package org.kobjects.nlp.api;

public enum WordType {
	ADJECTIVE("ADJ"),
	ADVERB("ADV"),
	CONJUNCTION("CONJ"),
	INTERJUNCTION("INTERJ"),
	NOUN("N"),
	NUMERAL("NUM"),
	PREPOSITION("PREP"),
	PRONOUN("PRON"),
	VERB("V");
	
	private final String name;
	WordType(String name) {
		this.name = name;
	}
	public String toString() {
		return name;
	}
}