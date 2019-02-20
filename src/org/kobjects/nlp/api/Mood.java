package org.kobjects.nlp.api;

public enum Mood {
	INDICATIVE("IND"),
	IMPERATIVE("IMP"),
	SUBJUNCTIVE("SJV"),
	INFINITIVE("INF"),
	GERUND("GER"),
	GERUNDIVE("GRV"),
	PARTICIPLE("PTCP"),
	SUPINE("SUP");
	private final String abbr;
	Mood(String abbr) {
		this.abbr = abbr;
	}
	@Override
	public String toString() {
		return abbr;
	}
}