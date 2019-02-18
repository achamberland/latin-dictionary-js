package org.kobjects.nlp.api;

public enum Number {
	SINGULAR("SG"),
	PLURAL("PL");
	
	private final String name;
	
	Number(String name) {
		this.name = name;
	}
	
	@Override
	public String toString() {
		return name;
	}
}