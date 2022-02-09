import Conjugations from "./Conjugations.js";

export default function conjugate(present, infinitive, perfect, supine, conjugationNumber) {
  // Determine stem1 and conjugation
  let conjugation = null;
  let presentStem = null;
  
  if (conjugationNumber >= 1 && conjugationNumber <= 4) {
    const tentativeStem = present.endsWith("r") ? present.substring(0, present.length - 1) : present;
    let cut;

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
    } 
    presentStem = tentativeStem.substring(0, tentativeStem.length - cut);
  } else if (present === "possum") {
    conjugation = Conjugations.POSSE;
    presentStem = "";
  } else if (present.endsWith("sum")) {
    conjugation = Conjugations.ESSE;
    presentStem = present.substring(0, present.length - 3);
  } else {
    switch (present) {
      case "ferro":
        conjugation = Conjugations.FERRE;
        infinitive = "ferre";
        break;
      case "volo":
        conjugation = Conjugations.VELLE;
        infinitive = "velle";
        break;
      case "nolo":
        conjugation = Conjugations.NOLLE;
        infinitive = "nolle";
        break;
      case "malo":
        conjugation = Conjugations.MALLE;
        infinitive = "malle";
        break;
      case "eo":
        conjugation = Conjugations.IRE;
        infinitive = "ire";
        break;
      default:
        throw new Error("Conjugation not recgonized for: " + present);
    }
    presentStem = "";
  }

  // Determine stem2 and stem3
  let perfectStem = null;
  let passiveStem = null;
  
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
    }
  // Todo: Unsure what this case is about. Fix with variables/non-magic number
  } else if (perfect.endsWith(" sum")) {
    passiveStem = perfect.substring(0, perfect.length - 6);
    perfectStem = null;
  } else {
    perfectStem = perfect.substring(0, perfect.length - 1);
    if (supine != null && supine !== "-") {
      passiveStem = supine.substring(0, supine.length - 2);
    } else {
      passiveStem = "#";
    }
  } 
  
  const supineStem = (supine == null || supine.length < 2) ?
    null :
    supine.substring(0, supine.length - 2);
  
  return conjugation.apply(presentStem, infinitive, perfectStem, passiveStem, supineStem);
}
