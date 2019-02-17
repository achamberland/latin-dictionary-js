package org.kobjects.nlp.api;

public class FormBuilder {
	public Person person;
	public  Numerus numerus;
	public Modus modus;
	public Tempus tempus;
	public GenusVerbi genusVerbi;
	public Case casus;
	public Genus genus;

	public FormBuilder setPerson(Person person) {
		this.person = person;
		return this;
	}
	public FormBuilder setNumerus(Numerus numerus) {
		this.numerus = numerus;
		return this;
	}
	public FormBuilder setModus(Modus modus) {
		this.modus = modus;
		return this;
	}
	public FormBuilder setTempus(Tempus tempus) {
		this.tempus = tempus;
		return this;
	}
	public FormBuilder setGenusVerbi(GenusVerbi genusVerbi) {
		this.genusVerbi = genusVerbi;
		return this;
	}
	public FormBuilder setCasus(Case casus) {
		this.casus = casus;
		return this;
	}
	public FormBuilder setGenus(Genus genus) {
		this.genus = genus;
		return this;
	}
	
	public Form build() {
		return new Form(person, numerus, modus, tempus, genusVerbi, casus, genus);
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
			genusVerbi = GenusVerbi.AKTIV;
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
				this.tempus = Tempus.FUTUR_2;
			} else {
				this.tempus = Tempus.FUTUR_1;
			}
		} else {
			this.genus = Genus.FEMININUM;
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
			this.tempus = Tempus.IMPERFEKT;
		} else if (string.startsWith("imp")) {
			if (modus != null || person != null) {
				this.tempus = Tempus.IMPERFEKT;
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
		this.genus = Genus.MASCULINUM;
		break;
	case 'n':
		if (string.startsWith("no")) {
			this.casus = Case.NOMINATIVE;
		} else {
			this.genus = Genus.NEUTRUM;
		}
		break;
	case 'p':
		if (string.startsWith("pas")) {
			this.genusVerbi = GenusVerbi.PASSIV;
		} else if (string.startsWith("part")) {
			this.modus = Modus.PARTIZIP;
		} else if (string.startsWith("perf")) {
			this.tempus = Tempus.PERFEKT;
		} else if (string.startsWith("plus")) {
			this.tempus = Tempus.PLUSQUAMPERFEKT;
		} else if (string.startsWith("pl")) {
			this.numerus = Numerus.PLURAL;
		} else if (string.startsWith("praes")) {
			this.tempus = Tempus.PRAESENS;
		} else if (string.startsWith("praet")) {
			this.tempus = Tempus.IMPERFEKT;
		} else {
			return false;
		}
		break;
	case 's':
		numerus = Numerus.SINGULAR;
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

	public Genus getGenus() {
		return genus;
	}
}