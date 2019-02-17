package org.kobjects.nlp.api;

import java.util.Set;

public interface Language {
	
	String getName();
	
	
	Set<Word> find(String word);
	
}
