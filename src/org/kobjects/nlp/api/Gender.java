package org.kobjects.nlp.api;

public enum Gender {
	MASCULINE("M"),
	FEMININE("F"),
	NEUTER("N");
	private final String name;
	Gender(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}