package org.kobjects.nlp.api;

public enum GenusVerbi {
	AKTIV("Akt."),
	PASSIV("Pass.");
	private final String name;
	GenusVerbi(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}