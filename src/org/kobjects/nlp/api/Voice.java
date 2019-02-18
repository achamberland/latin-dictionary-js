package org.kobjects.nlp.api;

public enum Voice {
	ACTIVE("ACT"),
	PASSIVE("PASS");
	private final String name;
	Voice(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}