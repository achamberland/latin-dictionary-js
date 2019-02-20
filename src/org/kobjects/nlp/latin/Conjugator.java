package org.kobjects.nlp.latin;

import java.util.Map;

import org.kobjects.nlp.api.Form;

public class Conjugator {
  
  public static Map<Form, String> conjugate(String present, String infinitive, String perfect, String supine, int k) {
    // Determine stem1 and conjugation
    final Conjugation conjugation;
    final String presentStem;
    
    if (k >= 1 && k <= 4) {
      String tentativeStem = present.endsWith("r") ? present.substring(0, present.length() - 1) : present;
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
        if (tentativeStem.endsWith("io")) {
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
      presentStem = tentativeStem.substring(0, tentativeStem.length() - cut);
    } else {
      if (present.equals("possum")) {
        conjugation = Conjugation.POSSE;
        presentStem = "";
      } else if (present.endsWith("sum")) {
		conjugation = Conjugation.ESSE;
		presentStem = present.substring(0, present.length() - 3);
      } else {
		switch (present) {
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
		default:
		  throw new RuntimeException("Conjugation not recgonized for " + present);
		}
		presentStem = "";
      }
    }

    // Determine stem2 and stem3
	
    String infinitveStem;
    String perfectStem;
    
    if (infinitive == null && k >= 1 && k <= 4) {
      switch (k) {
      case 1:
        infinitveStem = presentStem + "av";
        perfectStem = presentStem + "at";
        break;
      case 3:
        infinitveStem = presentStem + "iv";
        perfectStem = presentStem + "it";
        break;
      case 2:
        infinitveStem = presentStem + "ev";
        perfectStem = presentStem + "et";
        break;
      case 4:
        infinitveStem = presentStem + "v";
        perfectStem = presentStem + "t";
        break;
      default:
        throw new RuntimeException("Klasse: " + k);
      }
    } else {
      if (infinitive.endsWith(" sum")) {
        perfectStem = infinitive.substring(0, infinitive.length() - 6);
        infinitveStem = null;
      } else {
        infinitveStem = infinitive.substring(0, infinitive.length() - 1);
        if (perfect != null && !perfect.equals("-")) {
          perfectStem = perfect.substring(0, perfect.length() - 1);
        } else {
          perfectStem = "#";
        }
      } 
    }
    return conjugation.apply(presentStem, infinitveStem, perfectStem);
  }
}
