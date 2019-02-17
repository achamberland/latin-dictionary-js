package org.kobjects.nlp.api;

public enum Modus {
	INDIKATIV("Ind."),
	IMPERATIV("Imp."),
	KONJUNKTIV("Konj."),
	INFINITIV("Inf."),
	GERUNDIUM("Gerundium"),
	GERUNDIVUM("Gerundivum"),
	PARTIZIP("Part."),
	SUPINUM("Supinum");
	private final String name;
	Modus(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}