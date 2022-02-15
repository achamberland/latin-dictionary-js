import FormBuilder from "./FormBuilder.js";

export default class Word {
	constructor(word, form, definition) {
		this.word = word;
		this.form = form;
		this.definition = definition;
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

	static toPreferredString(words, wordType) {
		wordType = wordType.toUpperCase();
		const defs = Word.formsByDefinition(words);
		if (!defs.size) {
			return "";
		}
		for (let [def] of defs) {
			if (def.type === wordType) {
				return def.toString();
			}
		}
		return Object.keys(defs)[0].toString();
	}

	static toString(words) {
		const defs = Word.formsByDefinition(words);
		const result = [];
		for (let [key, forms] of defs) {
			let sb = "";
			if (forms.length === 1) {
				const form = forms[0];
				if (!form.equals(FormBuilder.EMPTY)) {
					sb += form + " of ";
				}
			} else {
				sb += forms.join(",") + " of ";
			}
			sb += key;
			result.push(sb);
		}
		return result;
	}
}
