import Form from "./Form.js";
import FormBuilder from "./FormBuilder.js";
import Word from "./Word.js";

export default class Definition {
	constructor(type, description) {
		this.type = type;
		this.description = description;
		this.translations = new Map();
		this.forms = new Map();
		this.genus = undefined;
	}

	// Acts like how this.forms.get(identicalOtherFormInstance) would've worked
	getWord(form) {
		const match = Array.from(this.forms).find(([formWordKey]) => (
			formWordKey.equals(form)
		));
		return match && match[1];
	}
	
	toString() {
		return this.type + " " + this.description;
	}
	
	addFormless(word) {
		this.forms.set(FormBuilder.EMPTY, new Word(word, FormBuilder.EMPTY, this));
		return this;
	}
	
	addForms(map) {
		map.forEach((wordString, form) => {
			this.forms.set(form, new Word(wordString, form, this));
		});
		return this;
	}
}
