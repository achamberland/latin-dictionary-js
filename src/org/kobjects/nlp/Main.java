package org.kobjects.nlp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.kobjects.nlp.api.Case;
import org.kobjects.nlp.api.Definition;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Gender;
import org.kobjects.nlp.api.Mood;
import org.kobjects.nlp.api.Number;
import org.kobjects.nlp.api.Person;
import org.kobjects.nlp.api.Strings;
import org.kobjects.nlp.api.Tense;
import org.kobjects.nlp.api.Voice;
import org.kobjects.nlp.api.Word;
import org.kobjects.nlp.api.WordType;
import org.kobjects.nlp.latin.Latin;

public class Main {

	static String lettersOnly(String s) {
		StringBuilder sb = new StringBuilder(s.length());
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			switch (c) {
			case 'æ':
				sb.append("ae");
				break;
			default:
				if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
					sb.append(c);
				}
			}
		}
		return sb.length() == 0 ? s : sb.toString();
	}
	
	static String fill(String s, int len) {
		StringBuilder sb = new StringBuilder(s);
		while(sb.length() < len) {
			sb.append(' ');
		}
		return sb.toString();
	}
	
	static void listAllForms(Set<Word> words) {
	   Set<Definition> definitions = new HashSet<>();
	   for (Word word : words) {
	     System.out.println(word.word + ": " + word);
	     Definition definition = word.definition;
	     if (definitions.contains(definition)) {
	       continue;
	     }
	     if (definition.type == WordType.NOUN) {
	       FormBuilder formBuilder = new FormBuilder(definition.genus);
	       for (Case casus : Latin.CASES) {
	         System.out.print(Strings.fill(casus.toString(), 10));
	         formBuilder.casus = casus;
	         for (Number number : Number.values()) {
	           formBuilder.number = number;
	           Word wordForm = definition.forms.get(formBuilder.build());
	           System.out.print(Strings.fill(wordForm.word, 20));
	         }
	         System.out.println();
	       }
	     } else if (definition.type == WordType.VERB) {
	       for (Mood mood : new Mood[] {Mood.INDICATIVE, Mood.SUBJUNCTIVE, Mood.IMPERATIVE, Mood.PARTICIPLE, Mood.INFINITIVE}) {
             FormBuilder formBuilder = new FormBuilder(mood);
             System.out.println();
             System.out.println(mood.name() );
             System.out.println();
               
             System.out.print("            ");
               for (Tense tense : Tense.values()) {
                 System.out.print(Strings.fill(tense.name(), 20));
               }
               System.out.println();
               
               for (Voice voice : Voice.values()) {
                 formBuilder.voice = voice;

               if (mood == Mood.INDICATIVE || mood == Mood.SUBJUNCTIVE || mood == Mood.IMPERATIVE) {
            	 for (Number number : Number.values()) {
            	   formBuilder.number = number;
            	   for (Person person : mood == Mood.IMPERATIVE ? new Person[] {Person.SECOND, Person.THIRD} : Person.values()) {
            	     formBuilder.person = person;
                     System.out.print(Strings.fill("" + person + " " +number + " " + voice, 12));
                     for (Tense tense : Tense.values()) {
                       formBuilder.tense = tense;
                       Word wordForm = definition.forms.get(formBuilder.build());
                       if (wordForm == null) {
                         formBuilder.gender = Gender.MASCULINE;
                         wordForm = definition.forms.get(formBuilder.build());
                         formBuilder.gender = null;
                       }
                       System.out.print(Strings.fill("" + (wordForm == null ? "-" : wordForm.word), 20));
                     }
                     System.out.println();
                   }
                 }
               } else {
                 System.out.print(Strings.fill(voice.toString(), 12));
                 for (Tense tense : Tense.values()) {
                   formBuilder.tense = tense;
                   Word wordForm = definition.forms.get(formBuilder.build());
                   if (wordForm == null) {
                     formBuilder.gender = Gender.MASCULINE;
                     formBuilder.number = Number.SINGULAR;
                     wordForm = definition.forms.get(formBuilder.build());
                   }
                   if (wordForm == null) {
                     formBuilder.casus = Case.NOMINATIVE;
                     wordForm = definition.forms.get(formBuilder.build());
                   }
                   System.out.print(Strings.fill("" + (wordForm == null ? "-" : wordForm.word), 20));
                   formBuilder.gender = null;
                   formBuilder.number = null;
                   formBuilder.casus = null;
                 }
                 System.out.println();
               }
	         }
	       }
	     }
	     definitions.add(word.definition);
	   }
	}
	
	public static void main(String[] args) throws IOException {
		
		Latin latin = new Latin();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		
		while (true) {
			System.out.print("input> ");
			String input = reader.readLine();
			if (input == null) {
				break;
			}
			String[] words = input.split(" ");
			for (String s : words) {
				s = lettersOnly(s.toLowerCase());
				if (s.trim().isEmpty()) {
				  continue;
				}
				Set<Word> options = latin.find(s);
				if (options == null) {
					System.out.println(fill(s, 15) + ": (not found)");
				} else if (words.length == 1) {
				  listAllForms(options);
				} else {
					List<String> list = Word.toString(options);
					Iterator<String> i = list.iterator();
					System.out.println(fill(s, 15) + ": " + i.next());
					while (i.hasNext()) {
						System.out.println(fill("", 17) + i.next());
					}
				}
			}
		}
	}
}
