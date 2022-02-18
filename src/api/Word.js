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

	static toString(words, preferredWordType) {
		const defs = Word.formsByDefinition(words);
		const result = [];
		if (preferredWordType) {
			preferredWordType = preferredWordType.toUpperCase();
		}
		for (let [def, forms] of defs) {
			if (preferredWordType && def.type !== preferredWordType) {
				continue;
			}
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
