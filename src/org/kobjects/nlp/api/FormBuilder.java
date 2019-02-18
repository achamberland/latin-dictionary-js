package org.kobjects.nlp.api;

public class FormBuilder {
	public Person person;
	public Number number;
	public Modus modus;
	public Tense tense;
	public Voice voice;
	public Case casus;
	public Gender gender;
	public Degree degree;

	public Form build() {
		return new Form(person, number, modus, tense, voice, casus, gender, degree);
	}


	/**
	 * Set a single aspect of the form determined by the given string.
	 * @param {string} s
	 */
	public boolean setAspect(String string) {
	string = string.toLowerCase();
	switch (string.charAt(0)) {
	case '1':
		person = Person.FIRST;
		break;
	case '2':
		person = Person.SECOND;
		break;
	case '3':
		person = Person.THIRD;
		break;
	case 'a':
		if (string.startsWith("akt")) {
			voice = Voice.ACTIVE;
		} else if (string.startsWith("abl")) {
			casus = Case.ABLATIVE;
		} else if (string.startsWith("abl")) {
			casus = Case.ABLATIVE;
		} else if (string.startsWith("akk")) {
			casus = Case.ACCUSATIVE;
		} else {
			return false;
		}
		break;
	case 'd':
		if (string.startsWith("dat")) {
			casus = Case.DATIVE;
		} else {
			return false;
		}
		break;
	case 'f':
		if (string.startsWith("fut")) {
			if (string.endsWith("ii") || string.endsWith("2")) {
				this.tense = Tense.FUTURE_PERFECT;
			} else {
				this.tense = Tense.FUTURE;
			}
		} else {
			this.gender = Gender.FEMININE;
		}
		break;
	case 'g':
		if (string.startsWith("gerundium")) {
			modus = Modus.GERUNDIUM;
		} else if (string.startsWith("gerundivum")) {
			modus = Modus.GERUNDIVUM;
		} else if (string.startsWith("gen")) {
			casus = Case.GENITIVE;
		} else {
			return false;
		}
		break;
	case 'i':
		if (string.startsWith("ind")) {
			this.modus = Modus.INDIKATIV;
		} else if (string.startsWith("inf")) {
			this.modus = Modus.INFINITIV;
		} else if (string.startsWith("impf") || string.startsWith("imperf")) {
			this.tense = Tense.IMPERFEKT;
		} else if (string.startsWith("imp")) {
			if (modus != null || person != null) {
				this.tense = Tense.IMPERFEKT;
			} else {
				this.modus = Modus.IMPERATIV;
			}
		}
		break;
	case 'k':
		if (string.startsWith("konj")) {
			this.modus = Modus.KONJUNKTIV;
		} else {
			return false;
		}
		break;
	case 'm':
		this.gender = Gender.MASCULINE;
		break;
	case 'n':
		if (string.startsWith("no")) {
			this.casus = Case.NOMINATIVE;
		} else {
			this.gender = Gender.NEUTER;
		}
		break;
	case 'p':
		if (string.startsWith("pas")) {
			this.voice = Voice.PASSIVE;
		} else if (string.startsWith("part")) {
			this.modus = Modus.PARTIZIP;
		} else if (string.startsWith("perf")) {
			this.tense = Tense.PERFEKT;
		} else if (string.startsWith("plus")) {
			this.tense = Tense.PAST_PERFECT;
		} else if (string.startsWith("pl")) {
			this.number = Number.PLURAL;
		} else if (string.startsWith("praes")) {
			this.tense = Tense.PRESENT;
		} else if (string.startsWith("praet")) {
			this.tense = Tense.IMPERFEKT;
		} else {
			return false;
		}
		break;
	case 's':
		number = Number.SINGULAR;
		break;
	case 'v':
		if (string.startsWith("vok")) {
			casus = Case.VOCATIVE;
		} else {
			return false;
		}
		break;
	default:
		return false;
	} // switch
	return true;
}

	public Gender getGenus() {
		return gender;
	}
}