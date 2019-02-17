package org.kobjects.nlp.api;

public enum Numerus {
	SINGULAR("Sg."),
	PLURAL("Pl.");
	
	private final String name;
	
	Numerus(String name) {
		this.name = name;
	}
	
	@Override
	public String toString() {
		return name;
	}
}