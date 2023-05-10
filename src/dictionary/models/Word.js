import Case from "../constants/Case.js";
import FormBuilder from "./FormBuilder.js";
import Mood from "../constants/Mood.js";
import Person from "../constants/Person.js";
import Tense from "../constants/Tense.js";
import Voice from "../constants/Voice.js";
import WordType from "../constants/WordType.js";

export default class Word {
	constructor(word, form, definition) {
		this.word = word;
		this.form = form;
		this.definition = definition;
	}

	get rootForm() {
		switch(this.definition.type) {
			// Return Nominative form
			// (Todo: probably should be genitive)
			case WordType.NOUN:
			case WordType.PRONOUN:
			case WordType.ADJECTIVE:
				return new FormBuilder(
          Case.NOMINATIVE,
          this.form.plurality,
          this.form.gender
        ).build();
			// Return First-Person Present form
			case WordType.VERB:
			case WordType.ADVERB:
        return new FormBuilder(
          Mood.INDICATIVE,
          Person.FIRST,
          Tense.PRESENT,
          Voice.ACTIVE,
          // Verb shouldn't be like this, but it do
          // Todo: Remove plurality from all non-ptcp translations.
					//   Conjugation ends up being "[verb] sumus" etc with plural
          this.form.plurality
        ).build();
			// Todo: confirm each should have no special form
			case WordType.PREPOSITION:
			case WordType.CONJUNCTION:
			case WordType.NUMERAL:
				return this.form;
			default:
				throw new Error("Unsupported word type: `" + this.definition.type + "`")
		}
	}

	get rootWord() {
		const form = this.rootForm;
		return this.definition.getWord(form);
	}
	
	toString() {
		return (FormBuilder.EMPTY.equals(this.form) ? "" : (this.form + " of ")) + this.definition;
	}

	static formsByDefinition(words) {
		let defs = new Map();
		for (let word of words) {
			let forms = defs.get(word.definition);
			if (forms == null) {
				forms = [];
				defs.set(word.definition, forms);
			}
			forms.push(word.form);
		}
		return defs;
	}

	static allFormsToString(words) {
		const defs = Word.formsByDefinition(words);
		const result = [];
		for (let [def, forms] of defs) {
			let sb = "";
			if (forms.length === 1) {
				const form = forms[0];
				if (!form.equals(FormBuilder.EMPTY)) {
					sb += form + " of ";
				}
			} else {
				sb += forms.join(",") + " of ";
			}
			sb += def;
			result.push(sb);
		}
		return result;
	}
}
