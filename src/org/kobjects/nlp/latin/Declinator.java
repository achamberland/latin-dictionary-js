package org.kobjects.nlp.latin;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Case;
import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Genus;
import org.kobjects.nlp.api.Numerus;

/**
 * Class that is able to decline a Latin noun, given the genus, nominative and genitve case.
 */
public class Declinator {
	
	// A stems
	private static final String[][] FIRST_DECLENSION = {
			{"1", "ae", "ae", "am", "a", "1"},
			{"ae", "arum", "is", "as", "is", "ae"}};

	// O stems
	private static final String[][] SECOND_DECLENSION = {
			{"1", "i", "o", "um", "o", "1"},
		    {"a/i", "orum", "is", "a/os", "is", "a/i"}};
	
	// O stem with nomitnative ending in -us 
	// TODO: Wikipedia says to -ius or -ium
	private static final String[][] SECOND_DECLENSION_US = {
			{"1", "i", "o", "um", "o", "e"},
            {"a/i", "orum", "is", "a/os", "is", "a/i"}};
	
	// I/consonant stem
	private static final String[][] THIRD_DECLENSION_MIXED = {
			{"1", "is", "i", "em", "e", "1"}, 			
            {"es", "ium", "ibus", "es", "ibus", "es"}};
	
	private static final String[][] THIRD_DECLENSION_I = {
			{"1", "is", "i", "im/e", "i", "1"},
			{"es/ia", "ium", "ibus", "es/ia", "ibus", "es/ia"}};
	
	private static final String[][] THIRD_DECLENSION_CONSONANT = {
			{"1" , "is", "i", "em/1", "e", "1"}, 
			{"es/a", "um", "ibus", "es/a", "ibus", "es/a"}};
	
	// U stems
	private static final String[][] FOURTH_DECLENSION = {
			{"1", "us", "ui/u", "um/u", "u", "1"}, 
            {"us/ua", "uum", "ibus", "us/ua", "ibus", "us/ua"}};
	
	// E stems
	private static final String[][] FIFTH_DECLENSION = {
			{"1", "ei", "ei", "em", "e", "1"},
			{"es", "erum", "ebus", "es", "ebus", "es"}};

	private static final String[][] UNDECLINED = {
			{"1", "1", "1", "1", "1", "1"},
			{"1", "1", "1", "1", "1", "1"}};
	
	public static Map<Form, String> declineAdjective(String... word) {
		Map<Form, String> result = new LinkedHashMap<Form, String>();
		String stem = getStem(word[0]);
		if (word.length == 3) {
			decline(result, Genus.MASCULINUM, word[0], stem, 2);
			decline(result, Genus.FEMININUM, word[1], stem, 1);
			decline(result, Genus.NEUTRUM, word[2], stem, 2);
		} else if (word.length == 2) {
			if (word[1].endsWith("e")) {
				decline(result, Genus.MASCULINUM, word[0], stem, 3);
				decline(result, Genus.FEMININUM, word[0], stem, 3);
				decline(result, Genus.NEUTRUM, word[1], stem, 3);
			} else if (word[1].endsWith("is")) {
				decline(result, Genus.MASCULINUM, word[0], stem, 3);
				decline(result, Genus.FEMININUM, word[0], stem, 3);
				decline(result, Genus.NEUTRUM, word[0], stem, 3);
			} else {
				throw new RuntimeException("Adjective 2-form not recognized: " + Arrays.toString(word));
			}
		} else if (word.length > 3) {
			if (word[1].endsWith(" (gen.)")) {
				return declineAdjective(word[0], word[1].substring(0, word[1].length() - 7));
			} else {
				throw new RuntimeException("Unrecognized Ajective declination: " + Arrays.toString(word));
			}
		} else {
			throw new RuntimeException("Unrecognized Ajective declination: " + Arrays.toString(word));
		}
		return result;
	}
	
	/**
	 * Returns the declinations of the given word as a map.
	 */
	public static Map<Form, String> declineNoun(Genus genus, String... word) {
		String nominativ = word[0].trim();
		String genitive = word.length < 2 ? nominativ : word[1].trim();

		String stem;
		int declension;
		if (genitive.equals("undeclined")) {
			declension = 0;
			stem = null;
		} else {
			if (genitive.endsWith("(i)")) {
				// TODO: We just normalize to ii here.
				genitive = genitive.substring(0, genitive.length() -3) + "i";
			}
		
			// Genitive case given as suffix only -- construct the full genitive.
			if (genitive.charAt(0) == '-') {
				genitive = constructGenitive(nominativ, genitive.substring(1));
			} 
			int cutCount = genitive.endsWith("i") && !genitive.endsWith("ei") ? 1 : 2;
			stem = genitive.substring(0, genitive.length() - cutCount);
			String genitiveSuffix = genitive.substring(stem.length());
			switch (genitiveSuffix) {
			case "ae":
				declension = 1;
				break;
			case "i":
				declension = 2;
				break;
			case "is": 
				declension = 3;
				break;
			case "us": 
				declension = 4;
				break;
			case "ei":
				declension = 5;
				break;
			default:
				throw new RuntimeException("Declension not recognized for genitive case suffix: '" + genitiveSuffix + "'");
			}
		}
		Map<Form, String> result = new LinkedHashMap<Form, String>();
		decline(result, genus, nominativ, stem, declension);
		if (word.length > 2) {
			addIrregulatives(result, genus, stem, 2, word);
		}
		return result;
	}
	
	static void decline(Map<Form, String> result, Genus genus, String nominativ, String stem, int declension) {
		String[][] suffixes;
		switch (declension) {
		case 0:
			suffixes = UNDECLINED;
			break;
		case 1:
			suffixes = FIRST_DECLENSION;
			break;
		case 2:
			suffixes = nominativ.endsWith("us") ? SECOND_DECLENSION_US : SECOND_DECLENSION;
			break;
		case 3:
  			String nomintativeEnding = nominativ.endsWith("e") 
				? "e" : nominativ.substring(nominativ.length() - 2);
			if (stem.length() > 2 && Latin.consonantsOnly(stem.substring(stem.length() - 2)) 
					|| ((nomintativeEnding.equals("is") || nomintativeEnding.equals("es")) && Latin.syllableCount(stem + "is") == Latin.syllableCount(nominativ))) {
				suffixes = THIRD_DECLENSION_MIXED;
			} else if ((nomintativeEnding.equals("is") || nomintativeEnding.equals("e") || nomintativeEnding.equals("al") || nomintativeEnding.equals("ar")) &&  // i-stamm
					nominativ.substring(0, nominativ.length() - nomintativeEnding.length()).equals(stem)) {
				suffixes = THIRD_DECLENSION_I;
			} else { 
				suffixes = THIRD_DECLENSION_CONSONANT;
			}
			break;
		case 4:
			suffixes = FOURTH_DECLENSION;
			break;
		case 5:
			suffixes = FIFTH_DECLENSION;
			break;
		default:
			throw new RuntimeException("Invalid declension: " + declension);
		}
		
  		FormBuilder builder = new FormBuilder();
  		for (int n = 0; n < Latin.NUMERI.length; n++) {
  			builder.numerus = Latin.NUMERI[n];
  			String[] suffixesN = suffixes[n]; 
  			for (int i = 0; i < Latin.CASES.length; i++) {
  				builder.setCasus(Latin.CASES[i]);
  				String s = suffixesN[i];
  				if (s.equals("1")) {
  					s = nominativ;
  				} else {
  					int cut = s.indexOf('/');
  					if (cut == -1) {
  						s = stem + s;
  					} else if (builder.getGenus() == Genus.NEUTRUM) {
  						s = stem + s.substring(cut + 1);
  					} else {
  						s = stem + s.substring(0, cut);
  					}
  				}
  				result.put(builder.build(), s);
  			}
  		}
	}

  	static void addIrregulatives(Map<Form, String> result, Genus genus, String stem, int startIndex, String[] word)	 {
  		FormBuilder builder = new FormBuilder();
  		builder.genus = genus;
  		// Irregularities
  		for (int i = startIndex; i < word.length; i++) {
  			String s = word[i].trim();
  			switch(s.charAt(0)) {
  			case '1': builder.casus = Case.NOMINATIVE; break;
  			case '2': builder.casus = Case.GENITIVE; break;
  			case '3': builder.casus = Case.DATIVE; break;
  			case '4': builder.casus = Case.ACCUSATIVE; break;
  			case '5': builder.casus = Case.ABLATIVE; break;
  			case '6': builder.casus = Case.VOCATIVE; break;
  			default: throw new RuntimeException("Casus indicator (1-6) expected at position 1 but got: '" + s + "'.");
  			}
  			switch(Character.toUpperCase(s.charAt(1))) {
  			case 'S': builder.numerus = Numerus.SINGULAR; break;
  			case 'P': builder.numerus = Numerus.PLURAL; break;
  			default: throw new RuntimeException("Numerus indicator (S or P) expected at position 2 but got: '" + s + "'");
  			} 
  			if (s.charAt(2) != '=') {
  				throw new RuntimeException("'=' expected in '" + s + "' an position 3.");
  			}
  			s = s.substring(3).trim();
  			if (s.charAt(0) == '-') {
  				s = stem + s.substring(1);
  			}
  			result.put(builder.build(), s);
  		}
	}
	
  	public static String getStem(String nominative) {
  		if (Latin.isVocal(nominative.charAt(nominative.length() - 1))) {
			return nominative.substring(0, nominative.length() - 1);
		} 
  		return nominative.substring(0, nominative.length() - 2);
  	}
  	
	/**
	 * Constructs the full genitive case from the nominative and the genitive suffix.
	 */
	public static String constructGenitive(String nominative, String genitiveSuffix) {
		String stem;
		if (Latin.CONSONANTS.indexOf(genitiveSuffix.charAt(0)) != -1) {
			int i = nominative.length() - 1;
			while (i >= 0 && nominative.charAt(i) != genitiveSuffix.charAt(0)) {
				i--;
			}
			if (i == 0) {
				throw new RuntimeException("Unable to split off nominative cass suffix: '" + nominative + "'");
			}
			stem = nominative.substring(0, i);
		} else {
			stem = getStem(nominative);
		}
		return stem + genitiveSuffix;
	}
}
