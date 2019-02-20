package org.kobjects.nlp.latin;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Case;
import org.kobjects.nlp.api.Degree;
import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Gender;
import org.kobjects.nlp.api.Number;

/**
 * Class that is able to decline a Latin noun, given the genus, nominative and
 * genitive case.
 */
public class Declinator {

  // Special codes in the declension suffix tables: 
  // 1: refers to the Nominative. 
  // /: alternative suffix for neuter provide after the slash.
  
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
      {"1", "is", "i", "em/1", "e", "1"},
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

  /**
   * Declines an adjective. The variable words contains the Latin words of
   * defining the dictionary entry.
   */
  public static Map<Form, String> declineAdjective(String... words) {
    Map<Form, String> result = new LinkedHashMap<Form, String>();
    String stem = getStem(words[0]);
    int comparativeIndex = -1;
    if (words.length > 1 && words[1].trim().indexOf(' ') != -1) {
      // Multiple words in the second entry, split it into its parts.
      String[] parts1 = words[1].split(" ");
      if (parts1[1].equals("(gen.)") || parts1[1].equals("(gen)")) {
        // neclegens, neclegentis (gen.), neclegentior -or -us, neclegentissimus -a -um
        decline(result, Gender.MASCULINE, null, words[0], stem, 3);
        decline(result, Gender.FEMININE, null, words[0], stem, 3);
        decline(result, Gender.NEUTER, null, words[0], stem, 3);
        comparativeIndex = 2;
      } else {
        // acutus, acuta -um, acutior -or -us, acutissimus -a -um
        decline(result, Gender.MASCULINE, null, words[0], stem, 2);
        decline(result, Gender.FEMININE, null, parts1[0], stem, 1);
        decline(result, Gender.NEUTER, null, parts1[1], stem, 2);
        comparativeIndex = 2;
      }
      // TODO: Comparative, superlative.
    } else if (words.length > 2 && words[2].indexOf(' ') != -1) {
      // Multiple words in the third entry:
      // ocis, oce, ocior -or -us, ocissimus -a -um
      decline(result, Gender.MASCULINE, null, words[0], stem, 3);
      decline(result, Gender.FEMININE, null, words[0], stem, 3);
      decline(result, Gender.NEUTER, null, words[1], stem, 3);
      comparativeIndex = 2;
    } else if (words.length == 3) {
      if (words[1].equals("(gen.)")) {
        // militans, (gen.), militantis
        decline(result, Gender.MASCULINE, null, words[0], stem, 3);
        decline(result, Gender.FEMININE, null, words[0], stem, 3);
        decline(result, Gender.NEUTER, null, words[0], stem, 3);
      } else if (words[1].endsWith("e")) {
        // adfectualis, adfectualis, adfectuale
        decline(result, Gender.MASCULINE, null, words[0], stem, 3);
        decline(result, Gender.FEMININE, null, words[1], stem, 3);
        decline(result, Gender.NEUTER, null, words[2], stem, 3);
      } else {
        // acquisitus, acquisita, acquisitum
        decline(result, Gender.MASCULINE, null, words[0], stem, 2);
        decline(result, Gender.FEMININE, null, words[1], stem, 1);
        decline(result, Gender.NEUTER, null, words[2], stem, 2);
      }
    } else if (words.length == 2) {
      if (words[1].equals("undeclined")) {
        // adinstar, undeclined
        decline(result, Gender.MASCULINE, null, words[0], stem, 0);
        decline(result, Gender.FEMININE, null, words[0], stem, 0);
        decline(result, Gender.NEUTER, null, words[0], stem, 0);
      } else if (words[1].endsWith("e")) {
        decline(result, Gender.MASCULINE, null, words[0], stem, 3);
        decline(result, Gender.FEMININE, null, words[0], stem, 3);
        decline(result, Gender.NEUTER, null, words[1], stem, 3);
      } else if (words[1].endsWith("is")) {
        decline(result, Gender.MASCULINE, null, words[0], stem, 3);
        decline(result, Gender.FEMININE, null, words[0], stem, 3);
        decline(result, Gender.NEUTER, null, words[0], stem, 3);
      } else {
        throw new RuntimeException("Adjective 2-form not recognized: " + Arrays.toString(words));
      }
    } else {
      throw new RuntimeException("Unrecognized Ajective declination: " + Arrays.toString(words));
    }

    if (comparativeIndex != -1 && comparativeIndex < words.length) {
      String[] parts = words[comparativeIndex].split(" ");
      decline(result, Gender.MASCULINE, Degree.COPARATIVE, parts[0], stem, 2);
      decline(result, Gender.FEMININE, Degree.COPARATIVE, parts[1], stem, 1);
      decline(result, Gender.NEUTER, Degree.COPARATIVE, parts[2], stem, 2);
      if (comparativeIndex + 1 < words.length) {
        parts = words[comparativeIndex + 1].split(" ");
        decline(result, Gender.MASCULINE, Degree.SUPERLATIVE, parts[0], stem, 2);
        decline(result, Gender.FEMININE, Degree.SUPERLATIVE, parts[1], stem, 1);
        decline(result, Gender.NEUTER, Degree.SUPERLATIVE, parts[2], stem, 2);
      }
    }
    return result;
  }

  /**
   * Returns the declensions of the given word as a map. Words is expected to
   * contain the nominative and the genitive.
   */
  public static Map<Form, String> declineNoun(Gender genus, String... words) {
    String nominativ = words[0].trim();
    String genitive = words.length < 2 ? nominativ : words[1].trim();

    String stem;
    int declension;
    if (genitive.equals("undeclined")) {
      declension = 0;
      stem = null; // not needed -- nominative is inserted everywhere.
    } else {
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
    decline(result, genus, null, nominativ, stem, declension);
    if (words.length > 2) {
      addIrregulatives(result, genus, stem, 2, words);
    }
    return result;
  }

  static void decline(Map<Form, String> result, Gender genus, Degree degree, String nominative, String stem,
      int declension) {
    String[][] suffixes;
    if (nominative.startsWith("-")) {
      nominative = stem + nominative.substring(1);
    }

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
          || nomintativeEnding.equals("ar")) && // i-stamm
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

    FormBuilder builder = new FormBuilder();
    builder.degree = degree;
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

  static void addIrregulatives(Map<Form, String> result, Gender genus, String stem, int startIndex, String[] word) {
    FormBuilder builder = new FormBuilder();
    builder.gender = genus;
    // Irregularities
    for (int i = startIndex; i < word.length; i++) {
      String s = word[i].trim();
      switch (s.charAt(0)) {
      case '1':
        builder.casus = Case.NOMINATIVE;
        break;
      case '2':
        builder.casus = Case.GENITIVE;
        break;
      case '3':
        builder.casus = Case.DATIVE;
        break;
      case '4':
        builder.casus = Case.ACCUSATIVE;
        break;
      case '5':
        builder.casus = Case.ABLATIVE;
        break;
      case '6':
        builder.casus = Case.VOCATIVE;
        break;
      default:
        throw new RuntimeException("Casus indicator (1-6) expected at position 1 but got: '" + s + "'.");
      }
      switch (Character.toUpperCase(s.charAt(1))) {
      case 'S':
        builder.number = Number.SINGULAR;
        break;
      case 'P':
        builder.number = Number.PLURAL;
        break;
      default:
        throw new RuntimeException("Numerus indicator (S or P) expected at position 2 but got: '" + s + "'");
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
   * Constructs the full genitive case from the nominative and the genitive
   * suffix.
   */
  public static String constructGenitive(String nominative, String genitiveSuffix) {
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
      stem = getStem(nominative);
    }
    return stem + genitiveSuffix;
  }
}
