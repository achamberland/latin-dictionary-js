package org.kobjects.nlp.api;

public enum Tense {
	PRESENT("PRES"),
	IMPERFEKT("IMPERF"),
	PERFEKT("PERF"),
	PAST_PERFECT("PPFV"),
	FUTURE("FUT"),
	FUTURE_PERFECT("FUTP");
	private final String name;
	Tense(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}