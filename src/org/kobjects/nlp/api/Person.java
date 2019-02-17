package org.kobjects.nlp.api;

public enum Person {
	FIRST("1."),
	SECOND("2."),
	THIRD("3.");
	private final String name;
	Person(String name) {
		this.name = name;
	}
	
	@Override
	public String toString() {
		return name;
	}
}