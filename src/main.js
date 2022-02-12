import Case from "./api/Case.js";
import FormBuilder from "./api/FormBuilder.js";
import Gender from "./api/Gender.js";
import Mood from "./api/Mood.js";
import Person from "./api/Person.js";
import Plurality from "./api/Plurality.js";
import { fill } from "./api/Strings.js";
import Tense from "./api/Tense.js";
import Voice from "./api/Voice.js";
import Word from "./api/Word.js";
import WordType from "./api/WordType.js";
import Latin from "./latin/Latin.js";

export default class Main {
	static lettersOnly(str) {
		let output = "";
		for (let i = 0; i < str.length; i++) {
			const c = str.charAt(i);
			switch (c) {
			case 'æ':
				output += "ae";
				break;
			default:
				if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
					output += c;
				}
			}
		}
		return output.length === 0 ? str : output;
	}
	
	static listAllForms(wordSet) {
	   const definitionSet = new Set();
	   wordSet.forEach(word => {
	     console.log("\n" + word.word + ": " + word + "\n");
	     const definition = word.definition;
	     if (definitionSet.has(definition)) {
	       return;
	     }
	     if (definition.type === WordType.NOUN) {
	       const formBuilder = new FormBuilder(definition.genus);
	       for (let casus of Latin.CASES) {
	         console.log(fill(casus.toString(), 10));
	         formBuilder.casus = casus;
	         for (let plurality of Plurality) {
	           formBuilder.plurality = plurality;
	           const wordForm = definition.forms.get(formBuilder.build());
	           console.log(fill(wordForm.word, 20));
	         }
	         console.log("\n");
	       }
	     } else if (definition.type === WordType.VERB) {
				 const verbMoods = [Mood.INDICATIVE, Mood.SUBJUNCTIVE, Mood.IMPERATIVE, Mood.PARTICIPLE, Mood.INFINITIVE];
	       for (let mood of verbMoods) {
             console.log("\n");
             console.log(mood.name());
             console.log("\n");
               
             console.log("            ");
             for (let tense of Tense) {
               console.log(fill(tense.name(), 20));
             }
             console.log("\n");
               
             for (let voice of Voice) {
               if (mood === Mood.INDICATIVE || mood === Mood.SUBJUNCTIVE || mood === Mood.IMPERATIVE) {
            	 for (let plurality of Plurality) {
            	   for (let person of mood === Mood.IMPERATIVE ? [Person.SECOND, Person.THIRD] : Person) {
                     console.log(fill("" + person + " " + plurality + " " + voice, 12));
                     for (let tense of Tense) {
                       const formBuilder = new FormBuilder(mood, voice, plurality, person, tense);
                       let wordForm = definition.forms.get(formBuilder.build());
                       if (wordForm == null) {
                         formBuilder.gender = Gender.MASCULINE;
                         wordForm = definition.forms.get(formBuilder.build());
                         formBuilder.gender = null;
                       }
                       console.log(fill("" + (wordForm == null ? "-" : wordForm.word), 20));
                     }
                     console.log("\n");
                   }
                 }
               } else {
                 console.log(fill(voice.toString(), 12));
                 for (let tense of Tense) {
                   const formBuilder = new FormBuilder(mood, voice, tense);
                   let wordForm = definition.forms.get(formBuilder.build());
                   if (wordForm == null) {
                     formBuilder.gender = Gender.MASCULINE;
                     formBuilder.plurality = Plurality.SINGULAR;
                     wordForm = definition.forms.get(formBuilder.build());
                   }
                   if (wordForm == null) {
                     formBuilder.casus = Case.NOMINATIVE;
                     wordForm = definition.forms.get(formBuilder.build());
                   }
                   console.log(fill("" + (wordForm == null ? "-" : wordForm.word), 20));
                 }
                 console.log("\n");
               }
	         }
	       }
	     }
	     definitionSet.add(word.definition);
	   });
	}

	static translate(input, rawText) {
		const latin = new Latin(rawText);
		const words = input.split(" ");
		for (let s of words) {
			s = this.lettersOnly(s.toLowerCase());
			if (!s.trim()) {
				continue;
			}
			const options = latin.find(s);
			if (options == null) {
				console.log("\n" + fill(s, 15) + ": (not found)\n");
			} else if (words.length === 1) {
				this.listAllForms(options);
			} else {
				const list = Word.toString(options);
				console.log("\n" + fill(s, 15) + ": " + list.shift() + "\n");
				list.forEach((line, i) => {
					console.log("\n" + fill("", 17) + line + "\n");
				});
			}
		
		}
	}
}
