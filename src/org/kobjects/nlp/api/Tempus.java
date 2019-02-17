package org.kobjects.nlp.api;

public enum Tempus {
	PRAESENS("Praes."),
	IMPERFEKT("Impf."),
	PERFEKT("Perf"),
	PLUSQUAMPERFEKT("Plusqu."),
	FUTUR_1("Fut.1"),
	FUTUR_2("Fut.2");
	private final String name;
	Tempus(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}