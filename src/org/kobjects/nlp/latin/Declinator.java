package org.kobjects.nlp.latin;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Degree;
import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Gender;

/**
 * Class that is able to decline a Latin noun, given the genus, nominative and
 * genitive case.
 */
public class Declinator {
  // Special codes in the declension suffix tables: 
  // 1: refers to the Nominative. 
  // /: alternative suffix for neuter provided after the slash.
  
  private static final String[][] UNDECLINED = {
      {"1", "1", "1", "1", "1", "1"}, 
      {"1", "1", "1", "1", "1", "1"}};
  
  // A stems
  private static final String[][] FIRST_DECLENSION = {
      {"1",  "ae",   "ae", "am", "a",  "1"},
      {"ae", "arum", "is", "as", "is", "ae"}};

  // O stems
  private static final String[][] SECOND_DECLENSION = {
      {"1",   "i",    "o",  "um",   "o",  "1"},
      {"a/i", "orum", "is", "a/os", "is", "a/i"}};

  // O stem with nomitnative ending in -us
  // TODO: Wikipedia says to -ius or -ium
  private static final String[][] SECOND_DECLENSION_US = {
      {"1",   "i",    "o",  "um",   "o",  "e"},
      {"a/i", "orum", "is", "a/os", "is", "a/i"}};

  // I/consonant stem
  private static final String[][] THIRD_DECLENSION_MIXED = {
      {"1",  "is",  "i",    "em", "e",    "1"},
      {"es", "ium", "ibus", "es", "ibus", "es"}};

  private static final String[][] THIRD_DECLENSION_I = {
      {"1",     "is",  "i",    "im/e",  "i",    "1"},
      {"es/ia", "ium", "ibus", "es/ia", "ibus", "es/ia"}};

  private static final String[][] THIRD_DECLENSION_CONSONANT = {
      {"1",    "is", "i",    "em/1", "e",    "1"},
      {"es/a", "um", "ibus", "es/a", "ibus", "es/a"}};

  // U stems
  private static final String[][] FOURTH_DECLENSION = {
      {"1",     "us",  "ui/u", "um/u",  "u",    "1"},
      {"us/ua", "uum", "ibus", "us/ua", "ibus", "us/ua"}};

  // E stems
  private static final String[][] FIFTH_DECLENSION = {
      {"1",  "ei",   "ei",   "em", "e",    "1"},
      {"es", "erum", "ebus", "es", "ebus", "es"}};


  /**
   * Returns the declensions of the given word as a map. Words is expected to
   * contain the nominative and the genitive.
   */
  public static Map<Form, String> declineNoun(Gender genus, String nominative, String genitive) {
    String stem;
    int declension;
    if (genitive.equals("undeclined")) {
      // Perhaps we should just return a map with a single entry -- and the case and number unset?
      declension = 0;
      stem = null; // not needed -- nominative is inserted everywhere. 
    } else {
      String genitiveSuffix;
      if (genitive.charAt(0) == '-') {
        genitiveSuffix = genitive.substring(1);
      } else {
        int cutCount = genitive.endsWith("i") && !genitive.endsWith("ei") ? 1 : 2;
        genitiveSuffix = genitive.substring(genitive.length() - cutCount);
      }        
      stem = genitive.substring(0, genitive.length() - genitiveSuffix.length());
      switch (genitiveSuffix) {
      case "ae": declension = 1; break;
      case "i":  declension = 2; break;
      case "is": declension = 3; break;
      case "us": declension = 4; break;
      case "ei": declension = 5; break;
      default:
        throw new RuntimeException("Declension not recognized for genitive case suffix: '" + genitiveSuffix + "'");
      }
    }
    Map<Form, String> result = new LinkedHashMap<Form, String>();
    decline(result, null, genus, nominative, stem, declension);
    return result;
  }
  
  /**
   * Declines an adjective. The variable words contains the Latin words of
   * defining the dictionary entry.
   */
  public static Map<Form, String> declineAdjective(String[] words) {
    String nominativeMasculine = words[0];
    Map<Form, String> result = new LinkedHashMap<Form, String>();

    // Index of the comparative within words.
    int comparativeIndex = -1;
    
    // Basic degree
    
    if (words.length > 1 && words[1].indexOf(' ') != -1) {
      // Multiple words in the second entry, split it into its parts.
      String[] parts = words[1].split(" ");
      if (parts[1].equals("(gen.)") || parts[1].equals("(gen)")) {
        // neclegens, neclegentis (gen.), neclegentior -or -us, neclegentissimus -a -um
        String genitive = parts[0];
        String stem = genitive.substring(genitive.length() - 2);
        decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 3);
        decline(result, null, Gender.FEMININE, nominativeMasculine, stem, 3);
        decline(result, null, Gender.NEUTER, nominativeMasculine, stem, 3);
        comparativeIndex = 2;
      } 
      else {
        // acutus, acuta -um, acutior -or -us, acutissimus -a -um
        String stem = Latin.getStem(nominativeMasculine);
        decline(result, null, Gender.MASCULINE, words[0], stem, 2);
        decline(result, null, Gender.FEMININE, parts[0], stem, 1);
        decline(result, null, Gender.NEUTER, parts[1], stem, 2);
        comparativeIndex = 2;
      }
    } 
    else if (words.length > 2 && words[2].indexOf(' ') != -1) {
      // Multiple words in the third entry:
      // ocis, oce, ocior -or -us, ocissimus -a -um
      String stem = Latin.getStem(nominativeMasculine);
      decline(result, null, Gender.MASCULINE, words[0], stem, 3);
      decline(result, null, Gender.FEMININE, words[0], stem, 3);
      decline(result, null, Gender.NEUTER, words[1], stem, 3);
      comparativeIndex = 2;
    } else if (words.length == 3) {
      if (words[1].equals("(gen.)")) {
        // militans, (gen.), militantis
        String genitive = words[1];
        if (!genitive.endsWith("is")) {
          throw new RuntimeException("Genitive expected to end with 'is'");
        }
        String stem = genitive.substring(genitive.length() - 2);        
        decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 3);
        decline(result, null, Gender.FEMININE,  nominativeMasculine, stem, 3);
        decline(result, null, Gender.NEUTER,  nominativeMasculine, stem, 3);
      } else {
        String nominativeFeminine = words[1];
        String nominativeNeuter = words[2];
        String stem = Latin.getStem(nominativeMasculine);
        if (words[2].endsWith("e")) {
          // adfectualis, adfectualis, adfectuale
          decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 3);
          decline(result, null, Gender.FEMININE, nominativeFeminine, stem, 3);
          decline(result, null, Gender.NEUTER, nominativeNeuter, stem, 3);
        } else {
          // acquisitus, acquisita, acquisitum
          decline(result, null, Gender.MASCULINE, nominativeMasculine, stem, 2);
          decline(result, null, Gender.FEMININE, nominativeFeminine, stem, 1);
          decline(result, null, Gender.NEUTER, nominativeNeuter, stem, 2);
        }
      }
    } else if (words.length == 2) {
      if (words[1].equals("undeclined")) {
        // adinstar, undeclined
        decline(result, null, Gender.MASCULINE, words[0], null, 0);
        decline(result, null, Gender.FEMININE, words[0], null, 0);
        decline(result, null, Gender.NEUTER, words[0], null, 0);
      } else if (words[1].endsWith("e")) {
        String stem = Latin.getStem(nominativeMasculine);
        decline(result, null, Gender.MASCULINE, words[0], stem, 3);
        decline(result, null, Gender.FEMININE, words[0], stem, 3);
        decline(result, null, Gender.NEUTER, words[1], stem, 3);
      } else if (words[1].endsWith("is")) {
        String stem = Latin.getStem(nominativeMasculine);
        decline(result, null, Gender.MASCULINE, words[0], stem, 3);
        decline(result, null, Gender.FEMININE, words[0], stem, 3);
        decline(result, null, Gender.NEUTER, words[0], stem, 3);
      } else {
        throw new RuntimeException("Adjective 2-form not recognized: " + Arrays.toString(words));
      }
    } else {
      throw new RuntimeException("Unrecognized Ajective declination: " + Arrays.toString(words));
    }

    // comparative and superlative
    
    if (comparativeIndex != -1 && comparativeIndex < words.length) {
      String[] parts = words[comparativeIndex].split(" ");
      String stem = Latin.getStem(parts[0]);
      Form comparative = Form.of(Degree.COPARATIVE);
      decline(result, comparative, Gender.MASCULINE, parts[0], stem, 2);
      decline(result, comparative, Gender.FEMININE, parts[1], stem, 1);
      decline(result, comparative, Gender.NEUTER, parts[2], stem, 2);
      if (comparativeIndex + 1 < words.length) {
        stem = Latin.getStem(parts[0]);
        parts = words[comparativeIndex + 1].split(" ");
        Form superlative = Form.of(Degree.SUPERLATIVE);
        decline(result, superlative, Gender.MASCULINE, parts[0], stem, 2);
        decline(result, superlative, Gender.FEMININE, parts[1], stem, 1);
        decline(result, superlative, Gender.NEUTER, parts[2], stem, 2);
      }
    }
    return result;
  }

  
  /**
   * The actual declension routine, called from noun and adjective declension.
   * @param result map to add the results to
   * @param genus the genus of the noun or adjective
   * @param degree the degree of the adjective
   * @param nominative the nominative case of the word
   * @param stem the stem of the word.
   * @param declension the declension to use (0 for undeclensed or 1..5). 
   */
  public static void decline(Map<Form, String> result, Form form, Gender genus, String nominative, String stem,
      int declension) {
    
    // For adjectives, only the (gender specific) nominative suffix may be handed in.
    if (nominative.startsWith("-")) {
      nominative = stem + nominative.substring(1);
    }

    String[][] suffixes;
    switch (declension) {
    case 0:
      suffixes = UNDECLINED;
      break;
    case 1:
      suffixes = FIRST_DECLENSION;
      break;
    case 2:
      suffixes = nominative.endsWith("us") ? SECOND_DECLENSION_US : SECOND_DECLENSION;
      break;
    case 3:
      String nomintativeEnding = nominative.endsWith("e") ? "e" : nominative.substring(nominative.length() - 2);
      if (stem.length() > 2 && Latin.consonantsOnly(stem.substring(stem.length() - 2))
          || ((nomintativeEnding.equals("is") || nomintativeEnding.equals("es"))
              && Latin.syllableCount(stem + "is") == Latin.syllableCount(nominative))) {
        suffixes = THIRD_DECLENSION_MIXED;
      } else if ((nomintativeEnding.equals("is") || nomintativeEnding.equals("e") || nomintativeEnding.equals("al")
          || nomintativeEnding.equals("ar")) && // i-stem
          nominative.substring(0, nominative.length() - nomintativeEnding.length()).equals(stem)) {
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

    FormBuilder builder = form == null ? new FormBuilder() : form.toBuilder();
    builder.gender = genus;
    for (int n = 0; n < Latin.NUMERI.length; n++) {
      builder.number = Latin.NUMERI[n];
      String[] suffixesN = suffixes[n];
      for (int i = 0; i < Latin.CASES.length; i++) {
        builder.casus = Latin.CASES[i];
        String s = suffixesN[i];
        if (s.equals("1")) {
          s = nominative;
        } else {
          int cut = s.indexOf('/');
          if (cut == -1) {
            s = stem + s;
          } else if (builder.getGenus() == Gender.NEUTER) {
            s = stem + s.substring(cut + 1);
          } else {
            s = stem + s.substring(0, cut);
          }
        }
        result.put(builder.build(), s);
      }
    }
  }
  
  /**
   * Constructs the full genitive case from the nominative and the genitive
   * suffix.
   */
  private static String constructGenitive(String nominative, String genitiveSuffix) {
    String stem;
    if (Latin.CONSONANTS.indexOf(genitiveSuffix.charAt(0)) != -1) {
      int i = nominative.length() - 1;
      while (i >= 0 && nominative.charAt(i) != genitiveSuffix.charAt(0)) {
        i--;
      }
      if (i == 0) {
        throw new RuntimeException("Unable to split off nominative case suffix: '" + nominative + "'");
      }
      stem = nominative.substring(0, i);
    } else {
      stem = Latin.getStem(nominative);
    }
    return stem + genitiveSuffix;
  }
}
