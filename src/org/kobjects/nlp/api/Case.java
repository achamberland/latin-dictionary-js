package org.kobjects.nlp.api;

public enum Case {
	NOMINATIVE("NOM"),
	GENITIVE("GEN"),
	DATIVE("DAT"),
	ACCUSATIVE("ACC"),
	ABLATIVE("ABL"),
	VOCATIVE("VOC");
	private final String name;
	Case(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return name;
	}
}