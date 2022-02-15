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

/*
 * TODO:
 * - Accept preferred forms array to prioritize which forms make it to the top
 */
export default class Translator {
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
	         for (let plurality of Object.values(Plurality)) {
	           formBuilder.plurality = plurality;
	           const wordForm = definition.getWord(formBuilder.build());
	           console.log(fill(wordForm.word, 20));
	         }
	         console.log("\n");
	       }
	     } else if (definition.type === WordType.VERB) {
				 const verbMoods = [Mood.INDICATIVE, Mood.SUBJUNCTIVE, Mood.IMPERATIVE, Mood.PARTICIPLE, Mood.INFINITIVE];
	       for (let mood of verbMoods) {
             console.log("\n");
             console.log(mood);
             console.log("\n");
               
             console.log("            ");
             for (let tense of Object.values(Tense)) {
               console.log(fill(tense, 20));
             }
             console.log("\n");
               
             for (let voice of Object.values(Voice)) {
               if (mood === Mood.INDICATIVE || mood === Mood.SUBJUNCTIVE || mood === Mood.IMPERATIVE) {
								for (let plurality of Object.values(Plurality)) {
									const avaliablePersons = mood === Mood.IMPERATIVE ? [Person.SECOND, Person.THIRD] : Object.values(Person);
									for (let person of avaliablePersons) {
										console.log(fill("" + person + " " + plurality + " " + voice, 12));
										for (let tense of Object.values(Tense)) {
											const formBuilder = new FormBuilder(mood, voice, plurality, person, tense);
											let wordForm = definition.getWord(formBuilder.build());
											if (wordForm == null) {
												formBuilder.gender = Gender.MASCULINE;
												wordForm = definition.getWord(formBuilder.build());
												formBuilder.gender = null;
											}
											console.log(fill("" + (wordForm == null ? "-" : wordForm.word), 20));
										}
										console.log("\n");
									}
								}
							} else {
								console.log(fill(voice, 12));
								for (let tense of Object.values(Tense)) {
									const formBuilder = new FormBuilder(mood, voice, tense);
									let wordForm = definition.getWord(formBuilder.build());
									if (wordForm == null) {
										for (let gender of Object.values(Gender)) {
											console.log(fill(gender + " " + voice, 12));
											formBuilder.gender = gender;
											formBuilder.plurality = Plurality.SINGULAR;
											wordForm = definition.getWord(formBuilder.build());
										
											if (wordForm == null) {
												formBuilder.casus = Case.NOMINATIVE;
												wordForm = definition.getWord(formBuilder.build());
											}
											console.log(fill("" + (wordForm == null ? "-" : wordForm.word), 20));
										}
									}
								}
								console.log("\n");
							}
	         }
	       }
	     }
	     definitionSet.add(word.definition);
	   });
	}

	constructor(rawText) {
		this.latin = new Latin(rawText);
	}

	translate(input) {
		const words = input.split(" ");
		for (let s of words) {
			s = Translator.lettersOnly(s.toLowerCase());
			if (!s.trim()) {
				continue;
			}
			const options = this.latin.find(s);
			if (options == null) {
				console.log("\n" + fill(s, 15) + ": (not found)\n");
			} else if (words.length === 1) {
				Translator.listAllForms(options);
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
