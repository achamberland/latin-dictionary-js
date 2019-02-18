package org.kobjects.nlp.api;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.kobjects.nlp.latin.Conjugator;

public class Definition {
	public final WordType type;
	public Map<Language, List<Definition>> translations = new LinkedHashMap<>();
	public Gender genus;
	public String description;
	public Map<Form, Word> forms = new LinkedHashMap<>();
	
	public Definition(WordType type, String description) {
		this.type = type;
		this.description = description;
	}
	
	@Override
	public String toString() {
		return type + " " + description;
	}
	
	public void addFormless(String word) {
		forms.put(Form.EMPTY, new Word(word, Form.EMPTY, this));
	}
	
	public void addForms(Map<Form, String> map) {
		for (Map.Entry<Form, String> entry : map.entrySet()) {
			forms.put(entry.getKey(), new Word(entry.getValue(), entry.getKey(), this));
		}
	}
	
}
