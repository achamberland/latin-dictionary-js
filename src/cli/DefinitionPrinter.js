import Case from "../dictionary/constants/Case.js";
import FormBuilder from "../dictionary/models/FormBuilder.js";
import Gender from "../dictionary/constants/Gender.js";
import Mood from "../dictionary/constants/Mood.js";
import Person from "../dictionary/constants/Person.js";
import Plurality from "../dictionary/constants/Plurality.js";
import { fill } from "../utils/stringUtils.js";
import Tense from "../dictionary/constants/Tense.js";
import Voice from "../dictionary/constants/Voice.js";
import Word from "../dictionary/models/Word.js";
import Dictionary from "../dictionary/Dictionary.js";
import WordType from "../dictionary/constants/WordType.js";
import { chooseWord } from "../utils/chooseWord.js";

/*
 * TODO:
 * - Add preferred capability to lists of words
 * - Fix filio declination
 * - Filter by age!=A,G,H
 */
export default class DefinitionLogger {
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
	       for (let casus of Object.values(Case)) {
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

	constructor(rawText = null, latin = null) {
		this.latin = latin || new Dictionary(rawText);
		if (!this.latin) {
			throw new Error("Must pass either raw dictionary text or a Latin dictionary instance")
		}
	}

	define(input, shouldTranslateAll = false) {
		const words = input.split(" ");
		for (let wordText of words) {
			wordText ||= "";
			let [text, manualType, after] = wordText.split(/\[|\]/, 3);
			let [_before, manualCase] = after ? after.split(/\(|\)/, 3) : [];

			text = DefinitionLogger.lettersOnly(text.toLowerCase());
			if (!text.trim()) {
				continue;
			}
			const wordOptions = this.latin.find(text);
			if (wordOptions == null) {
				console.log("\n" + fill(text, 15) + ": (not found)\n");
			} else if (words.length === 1 && !manualType && !manualCase) {
				DefinitionLogger.listAllForms(wordOptions);
			} else if (shouldTranslateAll) {
				const list = Word.allFormsToString(wordOptions);
				console.log("\n" + fill(text, 15) + ": " + list.shift() + "\n");
				list.forEach((line, i) => {
					console.log("\n" + fill("", 17) + line + "\n");
				});
			} else {
				const chosen = chooseWord(wordOptions, input, { manualType, manualCase });
				if (chosen) {
					const { definition, form } = chosen;
					console.log(`\n${fill(text, 15)}: ${form.casus ? `(${form.casus}) ` : ""}${definition}\n`);
				} else {
					console.log("(no translation found)");
				}
			}
		}
	}
}
