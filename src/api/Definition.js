import Form from "./Form.js";
import Word from "./Word.js";

export default class Definition {
	constructor(type, description) {
		this.type = type;
		this.description = description;
		this.translations = new Map();
		this.forms = new Map();
		this.genus = undefined;
	}
	
	toString() {
		return this.type + " " + this.description;
	}
	
	addFormless(word) {
		forms.set(Form.EMPTY, new Word(word, Form.EMPTY, this));
		return this;
	}
	
	addForms(map) {
		Object.entries(map).forEach(([key, value]) => {
			forms.set(key, new Word(value, key, this));
		});
		return this;
	}
}
