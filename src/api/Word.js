import Form from "./Form.js";

export default class Word {
	constructor(word, form, definition) {
		this.word = word;
		this.form = form;
		this.definition = definition;
	}
	
	toString() {
		return (Form.EMPTY.equals(this.form) ? "" : (this.form + " of ")) + this.definition;
	}

	static toString(words) {
		const defs = new Map();
		for (let word of words) {
			let forms = defs.get(word.definition);
			if (forms == null) {
				forms = [];
				defs.set(word.definition, forms);
			}
			forms.push(word.form);
		}
		const result = [];
		for (let [key, forms] of defs) {
			let sb = "";
			if (forms.length === 1) {
				const form = forms[0];
				if (!form.equals(Form.EMPTY)) {
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
