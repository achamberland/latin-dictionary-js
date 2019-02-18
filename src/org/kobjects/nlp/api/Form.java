package org.kobjects.nlp.api;

import java.util.Objects;

public class Form {
	public static final Form EMPTY = new FormBuilder().build();
	
	public final Person person;
	public final Number number;
	public final Modus modus;
	public final Tense tense;
	public final Voice voice;
	public final Case casus;
	public final Gender gender;

	Form(Person person, Number numerus, Modus modus, Tense tempus, Voice genusVerbi, Case casus, Gender genus) {
		this.person = person;
		this.number = numerus;
		this.modus = modus;
		this.tense = tempus;
		this.voice = genusVerbi;
		this.casus = casus;
		this.gender = genus;		
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		if (person != null) {
			sb.append(this.person).append(". ");
			if (number != null) {
				sb.append(this.number).append(' ');
			}
		}
		if (modus != null) {
			sb.append(modus).append(' ');
		}
		if (tense != null) {
		    sb.append(tense).append(' ');
		}
		if (voice != null) {
		    sb.append(voice).append(' ');
		}
		if (casus != null) {
		   sb.append(casus).append(' ');
		}
		if (person == null && number != null) {
		  sb.append(number).append(' ');
		}
		if (gender != null) {
		   sb.append(gender).append(' ');
		}
		sb.setLength(Math.max(0, sb.length() - 1));
		return sb.toString();
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(person, number, modus, tense, voice, casus, gender);
	}
	
	@Override 
	public boolean equals(Object o) {
		if (!(o instanceof Form)) {
			return false;
		}
		Form other = (Form) o;
		return Objects.equals(person, other.person) 
				&& Objects.equals(number, other.number)
				&& Objects.equals(modus, other.modus)
				&& Objects.equals(tense, other.tense)
				&& Objects.equals(voice, other.voice)
				&& Objects.equals(casus, other.casus)
				&& Objects.equals(gender,  other.gender);
	}	
}

