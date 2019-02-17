package org.kobjects.nlp.api;

public enum Genus {
	MASCULINUM("M."),
	FEMININUM("F."),
	NEUTRUM("N.");
	private final String name;
	Genus(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}