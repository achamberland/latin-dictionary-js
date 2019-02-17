package org.kobjects.nlp.api;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Word {
	public final String word;
	public final Form form;
	public final Definition definition;
	
	public Word(String word, Form form, Definition definition) {
		this.word = word;
		this.form = form;
		this.definition = definition;
	}
	
	@Override
	public String toString() {
		return (Form.EMPTY.equals(form) ? "" : (form + " of ")) + definition;
	}

	public static List<String> toString(Set<Word> words) {
		Map<Definition, Set<Form>> defs = new LinkedHashMap<>();
		for (Word word : words) {
			Set<Form> forms = defs.get(word.definition);
			if (forms == null) {
				forms = new LinkedHashSet<Form>();
				defs.put(word.definition, forms);
			}
			forms.add(word.form);
		}
		ArrayList<String> result = new ArrayList<>();
		for (Map.Entry<Definition, Set<Form>> entry : defs.entrySet()) {
			Set<Form> forms = entry.getValue();
			StringBuilder sb = new StringBuilder();
			if (forms.size() == 1) {
				Form form = forms.iterator().next();
				if (!form.equals(Form.EMPTY)) {
					sb.append(form).append(" of ");
				}
			} else {
				sb.append(forms).append(" of ");
			}
			sb.append(entry.getKey());
			result.add(sb.toString());
		}
		return result;
	}
	
}
