package org.kobjects.nlp.api;

import java.util.Objects;

public class Form {
	public static final Form EMPTY = new FormBuilder().build();
	
	public final Person person;
	public final Numerus numerus;
	public final Modus modus;
	public final Tempus tempus;
	public final GenusVerbi genusVerbi;
	public final Case casus;
	public final Genus genus;

	Form(Person person, Numerus numerus, Modus modus, Tempus tempus, GenusVerbi genusVerbi, Case casus, Genus genus) {
		this.person = person;
		this.numerus = numerus;
		this.modus = modus;
		this.tempus = tempus;
		this.genusVerbi = genusVerbi;
		this.casus = casus;
		this.genus = genus;		
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		if (person != null) {
			sb.append(this.person).append(". ");
			if (numerus != null) {
				sb.append(this.numerus).append(' ');
			}
		}
		if (modus != null) {
			sb.append(modus).append(' ');
		}
		if (tempus != null) {
		    sb.append(tempus).append(' ');
		}
		if (genusVerbi != null) {
		    sb.append(genusVerbi).append(' ');
		}
		if (casus != null) {
		   sb.append(casus).append(' ');
		}
		if (person == null && numerus != null) {
		  sb.append(numerus).append(' ');
		}
		if (genus != null) {
		   sb.append(genus).append(' ');
		}
		sb.setLength(Math.max(0, sb.length() - 1));
		return sb.toString();
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(person, numerus, modus, tempus, genusVerbi, casus, genus);
	}
	
	@Override 
	public boolean equals(Object o) {
		if (!(o instanceof Form)) {
			return false;
		}
		Form other = (Form) o;
		return Objects.equals(person, other.person) 
				&& Objects.equals(numerus, other.numerus)
				&& Objects.equals(modus, other.modus)
				&& Objects.equals(tempus, other.tempus)
				&& Objects.equals(genusVerbi, other.genusVerbi)
				&& Objects.equals(casus, other.casus)
				&& Objects.equals(genus,  other.genus);
	}	
}

