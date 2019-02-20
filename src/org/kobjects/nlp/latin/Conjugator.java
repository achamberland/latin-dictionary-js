package org.kobjects.nlp.latin;

import java.util.Map;

import org.kobjects.nlp.api.Form;

public class Conjugator {
  
  public static Map<Form, String> conjugate(int k, String... word) {
    String word1 = word[0];
    // Determine stem1 and conjugation
    final Conjugation conjugation;
    final String stem1;
		
    if (k >= 1 && k <= 4) {
      if (word1.endsWith("r")) {
        word1 = word1.substring(0, word1.length() - 1);
      }
      int cut;
      switch (k) {
      case 1:
        conjugation = Conjugation.FIRST_CONJUGATION;
        cut = 1;
        break;
      case 2: 
        conjugation = Conjugation.SECOND_CONJUGATION;
        cut = 2;
        break;
      case 3:
        if (word1.endsWith("io")) {
          conjugation = Conjugation.THIRD_CONJUGATION_I_STEM;
          cut = 2;
        } else {
          conjugation = Conjugation.THIRD_CONJUGATION;
          cut = 1;
        }
        break;
      case 4:
        conjugation = Conjugation.FOURTH_CONJUGATION;
        cut = 1;
        break;
        default:
          throw new RuntimeException("Impossible!");
      } 
      stem1 = word1.substring(0, word.length - cut);
    } else {
      if (word1.equals("possum")) {
        conjugation = Conjugation.POSSE;
        stem1 = "";
      } else if (word1.endsWith("sum")) {
		conjugation = Conjugation.ESSE;
		stem1 = word1.substring(0, word1.length() - 3);
      } else {
		switch (word1) {
		case "ferro":
		  conjugation = Conjugation.FERRE;    
		  break;
		case "volo":
		  conjugation = Conjugation.VOLE;
		  break;
		case "nolo":
		  conjugation = Conjugation.NOLE;
		  break;
		case "malo":
		  conjugation = Conjugation.MALE;
		  break;
		case "eo":
		  conjugation = Conjugation.E;
		  break;
		case "fio":
		  throw new RuntimeException("klasse = 13");
		default:
		  throw new RuntimeException("stamm1 nicht erkannt: " + word1);
		}
		stem1 = "";
      }
    }

    // Determine stem2 and stem3
	
    String stem2;
    String stem3;
    
    if (word.length == 1 && k >= 1 && k <= 4) {
      switch (k) {
      case 1:
        stem2 = stem1 + "av";
        stem3 = stem1 + "at";
        break;
      case 3:
        stem2 = stem1 + "iv";
        stem3 = stem1 + "it";
        break;
      case 2:
        stem2 = stem1 + "ev";
        stem3 = stem1 + "et";
        break;
      case 4:
        stem2 = stem1 + "v";
        stem3 = stem1 + "t";
        break;
      default:
        throw new RuntimeException("Klasse: " + k);
      }
    } else {
      String tentative2 = word[1].trim();
      if (tentative2.endsWith(" sum")) {
        stem3 = tentative2.substring(0, tentative2.length() - 6);
        stem2 = "#";
      } else {
        stem2 = tentative2.substring(0, tentative2.length() - 1);
        if (word.length > 2 && !word[2].trim().equals("-")) {
          String word3 = word[2].trim();
          stem3 = word3.substring(0, word3.length() - 2);
        } else {
          stem3 = "#";
        }
      } 
    }
    return conjugation.apply(stem1, stem2, stem3);
  }
}
