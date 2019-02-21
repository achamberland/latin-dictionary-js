package org.kobjects.nlp.latin;

import java.util.Map;

import org.kobjects.nlp.api.Form;

public class Conjugator {
  
  public static Map<Form, String> conjugate(String present, String infinitive, String perfect, String supine, int conjugationNumber) {
    // Determine stem1 and conjugation
    final Conjugation conjugation;
    final String presentStem;
    
    if (conjugationNumber >= 1 && conjugationNumber <= 4) {
      String tentativeStem = present.endsWith("r") ? present.substring(0, present.length() - 1) : present;
      int cut;
      switch (conjugationNumber) {
      case 1:
        conjugation = Conjugations.FIRST_CONJUGATION;
        cut = 1;
        break;
      case 2: 
        conjugation = Conjugations.SECOND_CONJUGATION;
        cut = 2;
        break;
      case 3:
        if (tentativeStem.endsWith("io")) {
          conjugation = Conjugations.THIRD_CONJUGATION_I_STEM;
          cut = 2;
        } else {
          conjugation = Conjugations.THIRD_CONJUGATION;
          cut = 1;
        }
        break;
      case 4:
        conjugation = Conjugations.FOURTH_CONJUGATION;
        cut = 1;
        break;
        default:
          throw new RuntimeException("Impossible!");
      } 
      presentStem = tentativeStem.substring(0, tentativeStem.length() - cut);
    } else {
      if (present.equals("possum")) {
        conjugation = Conjugations.POSSE;
        presentStem = "";
      } else if (present.endsWith("sum")) {
		conjugation = Conjugations.ESSE;
		presentStem = present.substring(0, present.length() - 3);
      } else {
		switch (present) {
		case "ferro":
		  conjugation = Conjugations.FERRE;    
		  break;
		case "volo":
		  conjugation = Conjugations.VOLE;
		  break;
		case "nolo":
		  conjugation = Conjugations.NOLE;
		  break;
		case "malo":
		  conjugation = Conjugations.MALE;
		  break;
		case "eo":
		  conjugation = Conjugations.E;
		  break;
		default:
		  throw new RuntimeException("Conjugation not recgonized for " + present);
		}
		presentStem = "";
      }
    }

    // Determine stem2 and stem3
	
//    String infinitveStem;
    String perfectStem;
    String passiveStem;
    
    if (infinitive == null && conjugationNumber >= 1 && conjugationNumber <= 4) {
      switch (conjugationNumber) {
      case 1:
        perfectStem = presentStem + "av";
        passiveStem = presentStem + "at";
        break;
      case 3:
        perfectStem = presentStem + "iv";
        passiveStem = presentStem + "it";
        break;
      case 2:
        perfectStem = presentStem + "ev";
        passiveStem = presentStem + "et";
        break;
      case 4:
        perfectStem = presentStem + "v";
        passiveStem = presentStem + "t";
        break;
      default:
        throw new RuntimeException("Klasse: " + conjugationNumber);
      }
    } else {
      if (perfect.endsWith(" sum")) {
        passiveStem = perfect.substring(0, perfect.length() - 6);
        perfectStem = null;
      } else {
        perfectStem = perfect.substring(0, perfect.length() - 1);
        if (supine != null && !supine.equals("-")) {
          passiveStem = supine.substring(0, supine.length() - 2);
        } else {
          passiveStem = "#";
        }
      } 
    }
    return conjugation.apply(presentStem, perfectStem, passiveStem);
  }
}
