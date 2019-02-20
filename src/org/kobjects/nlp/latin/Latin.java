package org.kobjects.nlp.latin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.kobjects.nlp.api.Definition;
import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.Case;
import org.kobjects.nlp.api.Gender;
import org.kobjects.nlp.api.Language;
import org.kobjects.nlp.api.Number;
import org.kobjects.nlp.api.Word;
import org.kobjects.nlp.api.WordType;

public class Latin implements Language {

	static final String VOCALS = "aeiouAEIOU";
	static final String CONSONANTS = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";

	static final Case[] CASES = { 
			Case.NOMINATIVE, 
			Case.DATIVE, 
			Case.GENITIVE, 
			Case.ACCUSATIVE, 
			Case.ABLATIVE,
			Case.VOCATIVE
	};

	static final Number[] NUMERI = { Number.SINGULAR, Number.PLURAL };

	static final Gender[] GENERA = { Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER };

	static boolean isConsonant(char c) {
		return CONSONANTS.indexOf(c) != -1;
	}

	static boolean isVocal(char c) {
		return VOCALS.indexOf(c) != -1;
	}

	/**
	 * Checks whether all characters in s are consonants.
	 */
	static boolean consonantsOnly(String s) {
		for (int i = 0; i < s.length(); i++) {
			if (CONSONANTS.indexOf(s.charAt(i)) == -1) {
				return false;
			}
		}
		return true;
	}

	static int syllableCount(String s) {
		int count = 0;
		for (int i = 0; i < s.length(); i++) {
			if (VOCALS.indexOf(s.charAt(i)) != -1) {
				count++;
			}
		}
		return count;
	}

	Map<String, Set<Word>> dictionary = new TreeMap<>();

	public Latin() throws IOException {
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(getClass().getResourceAsStream("whitaker_converted.txt"), "utf-8"));

		String nextLine = reader.readLine();
		while (nextLine != null) {
			String line = nextLine.trim();
			nextLine = reader.readLine();
			while (nextLine != null && nextLine.startsWith(" ")) {
				line += ' ' + nextLine.trim();
				nextLine = reader.readLine();
			}
			try {
				Definition definition = parseDefinition(line);
				if (definition != null) {
					for (Word word : definition.forms.values()) {
						String s = word.word;
						Set<Word> words = dictionary.get(s);
						if (words == null) {
							words = new LinkedHashSet<Word>();
							dictionary.put(s, words);
						}
						words.add(word);
					}
				}
			} catch (Exception e) {
				System.err.println("Error processing '" + line + "': " + e.getMessage());
				e.printStackTrace();
			}
		}
	}

	public Definition parseDefinition(String def) {
		def = def.toLowerCase();
		int colon = def.indexOf(":");
		if (colon == -1) {
			throw new RuntimeException(": expected.");
		}
		
		String[] leftParts = def.substring(0, colon).split(";");
		String[] wordParts = leftParts[0].trim().split(",");
		String[] typeParts = leftParts[1].trim().split(" ");
   	 	String[] metaParts = leftParts.length > 2 ? leftParts[2].split(",") : new String[0];

   	 	for (String meta: metaParts) {
   	 		meta = meta.trim();
   	 		if (meta.startsWith("f:") && meta.indexOf("frequent") == -1 && !meta.equals("f:common")) {
   	 			return null;
   	 		}
   	 	}

   	 	for (int i = 0; i < wordParts.length; i++) {
   	 		String word = wordParts[i].trim();
   	 		if (word.endsWith("(i)") || word.endsWith("(ii)")) {
   	 			word = word.substring(0, word.indexOf('(')) + 'i';
   	 		}
   	 		wordParts[i] = word;
   	 	}
   	 	
		String wordTypeName = typeParts[0];
		WordType type = null;
		for (WordType t : WordType.values()) {
			if (t.toString().equals(wordTypeName.toUpperCase())) {
				type = t;
				break;
			}
		}
		if (type == null) {
			throw new RuntimeException("Unrecognized word type: " + wordTypeName);
		}
		Definition definition = new Definition(type, def.substring(colon + 2).trim());
		
		switch (type) {
		case NOUN:
			processNoun(definition, wordParts, typeParts);
			break;
		case VERB:
			processVerb(definition, wordParts, typeParts);
			break;
		case ADJECTIVE:
			definition.addForms(Declinator.declineAdjective(wordParts));
			break;
		default:
			definition.addFormless(wordParts[0]);
		}
		return definition;
	}

	/**
	 * Bildet alle Formen eines Substantivs.
	 */
	private void processNoun(Definition definition, String[] word, String[] kind) {
		switch (kind[kind.length - 1].toUpperCase().trim()) {
		case "F":
			definition.genus = Gender.FEMININE;
			break;
		case "C":
		case "M":
			definition.genus = Gender.MASCULINE;
			break;
		case "N":
			definition.genus = Gender.NEUTER;
			break;
		default:
			throw new RuntimeException("Unrecognized genus '" + kind[kind.length - 1] + "'");
		}
		if (word.length != 2) {
		  throw new RuntimeException("Nominative and genitive expected for noun entries. Got: " + Arrays.toString(word));
		}
		definition.addForms(Declinator.declineNoun(definition.genus, word[0], word[1]));
	}

	/**
	 * Bildet alle Formen eines Verbs.
	 */
	void processVerb(Definition definition, String[] word, String[] kind) {
		String conjugationDescription = kind.length > 1 ? kind[1] : "0";
		if (conjugationDescription.startsWith("(")) {
			conjugationDescription = conjugationDescription.substring(1, 2);
		}
		int conjugation = conjugationDescription.length() == 1 && conjugationDescription.charAt(0) >= '1'
				&& conjugationDescription.charAt(0) <= '4' ? Integer.parseInt(conjugationDescription) : 0;

		for (Map.Entry<Form, String> entry : Conjugator.conjugate(conjugation, word).entrySet()) {
			definition.forms.put(entry.getKey(), new Word(entry.getValue(), entry.getKey(), definition));
		}
	};

	public String getName() {
		return "Latin";
	}

	@Override
	public Set<Word> find(String word) {
		return dictionary.get(word);
	}

  public static String getStem(String nominative) {
    if (isVocal(nominative.charAt(nominative.length() - 1))) {
      return nominative.substring(0, nominative.length() - 1);
    }
    return nominative.substring(0, nominative.length() - 2);
  }

}
