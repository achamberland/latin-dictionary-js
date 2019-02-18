package org.kobjects.nlp.latin;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Gender;
import org.kobjects.nlp.api.Voice;
import org.kobjects.nlp.api.Modus;
import org.kobjects.nlp.api.Number;
import org.kobjects.nlp.api.Person;
import org.kobjects.nlp.api.Tense;

public class Conjugator {

	public static Map<Form, String> conjugate(int conjugation, String... word) {
		return new Conjugator(conjugation, word).conjugate();
	}

	private final FormBuilder form = new FormBuilder();
	private final int conjugation;
	private final String stem1;
	private final String stem2;
	private final String stem3;
	private Map<Form, String> result;

	private Conjugator(int k, String... word) {
		String word1 = word[0].trim();

		// Determine stem1 and conjugation
		
		if (k >= 1 && k <= 4) {
			if (word1.endsWith("r")) {
				word1 = word1.substring(0, word1.length() - 1);
			}
			if (k == 3 && word1.endsWith("io")) {
				conjugation = 5;
			} else {
				conjugation = k;
			}
			stem1 = word1.substring(0, word1.length() - (conjugation == 2 || conjugation == 5 ? 2 : 1));

		} else {
			if (word1.equals("possum")) {
				stem1 = "";
				conjugation = 7;
			} else if (word1.endsWith("sum")) {
				conjugation = 6;
				stem1 = word1.substring(0, word1.length() - 3);
			} else {
				switch (word1) {
				case "ferro":
					conjugation = 8;
					break;
				case "volo":
					conjugation = 9;
					break;
				case "nolo":
					conjugation = 10;
					break;
				case "malo":
					conjugation = 11;
					break;
				case "eo":
					conjugation = 12;
					break;
				case "fio":
					throw new RuntimeException("klasse = 13");
				default:
					throw new RuntimeException("stamm1 nicht erkannt: " + word1);
				}
				stem1 = word1;
			}
		}

		// Determine stem2 and stem3
		
		if (word.length == 1 && conjugation <= 5) {
			switch (conjugation) {
			case 1:
				stem2 = stem1 + "av";
				stem3 = stem1 + "at";
				break;
			case 2:
				stem2 = stem1 + "ev";
				stem3 = stem1 + "et";
				break;
			case 4:
				stem2 = stem1 + "v";
				stem3 = stem1 + "t";
				break;
			case 3:
			case 5:
				stem2 = stem1 + "iv";
				stem3 = stem1 + "it";
				break;
			default:
				throw new RuntimeException("Klasse: " + conjugation);
			}
		} else {
			String tentative2 = word[1].trim();
			if (tentative2.endsWith(" sum")) {
				stem3 = tentative2.substring(0, tentative2.length() - 6);
				stem2 = "#";
			} else {
				stem2 = tentative2.substring(0, tentative2.length() - 1);
				if (word.length > 2 && !word[2].trim().equals("-")) {
					String word3 = word[2].trim();
					stem3 = word3.substring(0, word3.length() - 2);
				} else {
					stem3 = "#";
				}
			}
		}
	}

	Map<Form, String> conjugate() {
		result = new LinkedHashMap<>();
		form.modus = Modus.INDIKATIV;

		FormBuilder setModus = form;
		form.tense = Tense.PRESENT;
		FormBuilder setTempus = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi = form;
		add15("o,as,at,amus,atis,ant", "eo,es,et,emus,etis,ent", "o,is,it,imus,itis,unt", "o,s,t,mus,tis,unt",
				"io,is,it,imus,itis,iunt",

				"sum,es,est,sumus,estis,sunt", "possum,potes,potest,possumus,potestis,possunt",
				"fero,fers,fert,ferimus,fertis,ferunt", "volo,vis,vult,volumus,vultis,volunt",
				"nolo,non vis,non vult,nolumus,non vultis,nolunt", "malo,mavis,mavult,malumus,mavultis,malunt",
				"eo,is,it,imus,itis,eunt");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi1 = form;
		add15("or,aris,atur,amur,amini,antur", "eor,eris,etur, emur,emini,entur", "or,eris,itur,imur,imini,untur",
				"or,ris,tur,mur,mini,untur", "ior,eris,itur,imur,imini,iuntur",

				"#", "#", "feror,ferris,fertur,ferimur,ferimini,feruntur", "#", "#", "#", "#");
		form.tense = Tense.IMPERFEKT;

		FormBuilder setTempus1 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi2 = form;
		add12("ab,eb,eb,eb,ieb,er,poter,fereb,voleb,noleb,maleb,ib", "am,as,at,amus,atis,ant");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi3 = form;
		add12("a,e,e,e,ie,#,#,fere,#,#,#,#", "bar,baris,batur,bamur,bamini,bantur");
		form.tense = Tense.PERFEKT;

		FormBuilder setTempus2 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi4 = form;
		if (conjugation == 12) {
			add12("", "ii,isti,iit,iimus,istis,ierunt");
		} else {
			add2("i,isti,it,imus,istis,erunt");
		}
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi5 = form;
		add3("sum,es,est,sumus,estis,sunt");
		form.tense = Tense.PAST_PERFECT;

		FormBuilder setTempus3 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi6 = form;
		add2("eram,eras,erat,eramus,eratis,erant");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi7 = form;
		add3("eram,eras,erat,eramus,eratis,erant");
		form.tense = Tense.FUTURE;

		FormBuilder setTempus4 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi8 = form;
		add15(	"abo,abis,abit,abimus,abitis,abunt", 
				"ebo,ebis,ebit,ebimus,ebitis,ebunt",
				"am,es,et,emus,etis,ent",
				"am,es,et,emus,etis,ent", 
				"iam,ies,iet,iemus,ietis,ient",

				"ero,eris,erit,erimus,eritis,erunt", "potero,poteris,poterit,poterimus,poteritis,poterunt",
				"feram,feres,feret,feremus,feretis,ferent", "volam,voles,volet,volemus,voletis,volent",
				"nolam,noles,nolet,nolemus,noletis,nolent", "malam,males,malet,malemus,maletis,malent",
				"ibo,ibis,ibit,ibimus,ibitis,ibunt");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi9 = form;
		add15("abor,aberis,abitur,abimur,abimini,abuntur", "ebor,eberis,ebitur,ebimur,ebimini,ebuntur",
				"ar,eris,etur,emur,emini,euntur", "ar,eris,etur,emur,emini,euntur",
				"iar,ieris,ietur,iemur,iemini,euntur", "#", "#", "ferar,fereris,feretur,feremur,feremini,fereuntur",
				"#", "#", "#", "#");
		form.tense = Tense.FUTURE_PERFECT;

		FormBuilder setTempus5 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi10 = form;
		add2("ero,eris,erit,erimus,eritis,erint");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi11 = form;
		add3("ero,eris,erit,erimus,eritis,erunt");
		form.modus = Modus.KONJUNKTIV;

		FormBuilder setModus1 = form;
		form.tense = Tense.PRESENT;
		FormBuilder setTempus6 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi12 = form;
		add12("e,ea,a,a,ia,si,possi,fera,veli,noli,mali,ea", "m,s,t,mus,tis,nt");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi13 = form;
		add12("e,ea,a,a,ia,#,#,fera,#,#,#,#", "r,ris,tur,mur,mini,ntur");
		form.tense = Tense.IMPERFEKT;

		FormBuilder setTempus7 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi14 = form;
		add12("ar,er,er,r,er,ess,poss,ferr,vell,noll,mall,ir", "em,es,et,emus,etis,ent");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi15 = form;
		add12("a,e,e,,e,#,#,fer,#,#,#,#", "rer,reris,retur,remur,remini,rentur");
		form.tense = Tense.PERFEKT;

		FormBuilder setTempus8 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi16 = form;
		add2("erim,eris,erit,erimus,eritis,erint");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi17 = form;
		add3("sim,sis,sit,simus,sitis,sint");
		form.tense = Tense.PAST_PERFECT;

		FormBuilder setTempus9 = form;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi18 = form;
		add2("issem,isses,isset,issemus,issetis,issent");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi19 = form;
		add3("essem,esses,esset,essemus,essetis,essent");

		form.modus = Modus.IMPERATIV;

		form.tense = Tense.PRESENT;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi20 = form;
		add15("#,a,#,#,ate,#", "#,e,#,#,ete,#", "#,e,#,#,ite,#", "#,,#,#,te,#", "#,e,#,#,ite,#", "#,es,#,#,este,#",
				"#,potes,#,#,poteste,#", "#,fer,#,#,ferte,#", "#,noli,#,#,nolite,#", "#", "#", "#");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi21 = form;
		add15("#,are,are,#,amini,amini", "#,ere,ere,#,emini,emini", "#,ere,ere,#,imini,imini", "#,re,re,#,mini,mini",
				"#,ere,ere,#,imini,imini", "#", "#", "#", "#", "#", "#", "#");

		form.tense = Tense.FUTURE;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi22 = form;
		add15("#,ato,ato,#,atote,anto", "#,eto,eto,#,etote,ento", "#,ito,ito,#,itote,unto", "#,to,to,#,tote,unto",
				"#,ito,ito,#,itote,iunto", "#,esto,esto,#,estote,sunto", "#", "#,ferto,ferto,#,fertote,ferunto", "#",
				"#", "#", "#");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi23 = form;
		add15("#,ator,ator,#,antor,antor", "#,etor,etor,#,entor,entor", "#,itor,itor,#,untor,untor",
				"#,tor,tor,#,untor,untor", "#,itor,itor,#,iuntor,iuntor", "#", "#", "#", "#", "#", "#", "#");

		form.modus = Modus.INFINITIV;
		form.tense = Tense.PRESENT;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi24 = form;
		add15("are", "ere", "ere", "re", "ere", "esse", "posse", "ferre", "velle", "nolle", "malle", "ire");
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi25 = form;
		add15("ari", "eri", "i", "ri", "i", "#", "#", "ferri", "#", "#", "#", "#");
		form.tense = Tense.PERFEKT;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi26 = form;

		form.person = null;
		form.number = null;
		insertForm(stem2 + "isse");
		form.voice = Voice.PASSIVE;

		FormBuilder setGenusVerbi27 = form;
		form.gender = Gender.MASCULINE;
		insertForm(stem3 + "um esse");
		form.gender = Gender.FEMININE;
		insertForm(stem3 + "am esse");
		form.gender = Gender.NEUTER;
		insertForm(stem3 + "um esse");

		form.modus = Modus.GERUNDIUM;
		form.tense = null;
		form.gender = null;
		form.voice = null;
		add15("andi", "endi", "endi", "endi", "iendi", "#", "#", "#", "#", "#", "#", "eundi");

		form.modus = Modus.GERUNDIVUM;
		form.gender = Gender.MASCULINE;
		add15("andus", "endus", "endus", "endus", "iendus", "#", "#", "#", "#", "#", "#", "#");
		form.gender = Gender.FEMININE;
		add15("anda", "enda", "enda", "enda", "ienda", "#", "#", "#", "#", "#", "#", "#");

		form.gender = Gender.NEUTER;
		add15("andum", "endum", "endum", "endum", "iendum", "#", "#", "#", "#", "#", "#", "#");

		form.modus = Modus.SUPINUM;
		form.gender = null;
		insertForm(stem3 + "um");

		form.modus = Modus.PARTIZIP;
		form.tense = Tense.PRESENT;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi28 = form;
		add12("a,e,e,e,ie,#,#,#,velens,nolens,#,ie", "ns");

		form.tense = Tense.PERFEKT;
		form.voice = Voice.PASSIVE;
		FormBuilder setGenusVerbi29 = form;

		form.gender = Gender.MASCULINE;
		insertForm(stem3 + "us");
		form.gender = Gender.FEMININE;
		insertForm(stem3 + "a");
		form.gender = Gender.NEUTER;
		insertForm(stem3 + "um");

		form.tense = Tense.FUTURE;
		form.voice = Voice.ACTIVE;
		FormBuilder setGenusVerbi30 = form;

		form.gender = Gender.MASCULINE;
		insertForm(stem3 + "urus");
		form.gender = Gender.FEMININE;
		insertForm(stem3 + "ura");
		form.gender = Gender.NEUTER;
		insertForm(stem3 + "urum");

		return result;
	}

	void insertForm(String s) {
		if (conjugation == 6) {
			if (s.equals("proesse")) {
				s = "prodesse";
			} else if (s.startsWith("adfu")) {
				s += "+affu" + s.substring(5); // Was 6 (?)
			} else if (s.startsWith("obfu")) {
				s += "+offu" + s.substring(5); // Was 6 (?)
			}
		}
		// Insert (form, s, false);
		result.put(form.build(), s);
	}

	void add15(String[][] s) {
		add12(new String[0], s[conjugation - 1]);
	}
	
	void add15(String... s) {
		// console.log("add15("+s+")");
		add12("", s[conjugation - 1]);
	}

	void add2(String s) {
		add2(s.split("\\,"));
	}
	
	// numerus, person
	void add2(String[] parts) {
		form.gender = null;
		FormBuilder setGenus = form;
		int index = 0;
		for (int n = 0; n < 2; n++) {
			form.number = Latin.NUMERI[n];
			FormBuilder setNumerus = form;
			for (Person person : Person.values()) {
				form.person = person;
				FormBuilder setPerson = form;
				insertForm(stem2 + parts[index++]);
			}
		}
		form.person = null;
		form.number = null;
	}

	void add3(String s) {
		add3(s.split(","));
	}
	
	// Genus, numerus, person
	void add3(String[] parts) {
		if (parts.length != 6) {
			throw new RuntimeException("6 parts expected for add3 " + Arrays.toString(parts));
		}
		for (Gender genus : Latin.GENERA) {
			int index = 0;
			form.gender = genus;
			for (Number numerus : Latin.NUMERI) {
				form.number = numerus;
				String s1;
				if (form.number == Number.SINGULAR) {
					switch (form.gender) {
					case MASCULINE:
						s1 = "us";
						break;
					case FEMININE:
						s1 = "a";
						break;
					case NEUTER:
						s1 = "um";
						break;
					default:
						throw new RuntimeException();
					}
				} else {
					switch (form.gender) {
					case MASCULINE:
						s1 = "i";
						break;
					case FEMININE:
						s1 = "ae";
						break;
					case NEUTER:
						s1 = "a";
						break;
					default:
						throw new RuntimeException();
					}
				}
				for (Person person : Person.values()) {
					form.person = person;
					insertForm(stem3 + s1 + " " + parts[index++]);
				}
			}
		}
		form.gender = null;
	}

	
	void add12(String s0, String s) {
		String[] parts0 = s0.split(",");
		String[] parts = s.split(",");
		add12(parts0, parts);
	}

	void add12(String[] parts0, String[] parts) {
		int count = parts.length;
		String s1 = parts0.length > conjugation - 1 ? parts0[conjugation - 1] : "";
		int index = 0;

		if (count == 1) {
			form.number = null;
			form.person = null;
			insertForm(stem1 + s1 + parts[0]);
		} else {
			for (int n = 0; n < 2; n++) {
				form.number = n == 0 ? Number.SINGULAR : Number.PLURAL;
				if (count == 2) {
					form.person = null;
					insertForm(stem1 + s1 + parts[index++]);
				} else {
					for (Person person : Person.values()) {
						form.person = person;
						insertForm(stem1 + s1 + parts[index++]);
					}
				}
			}
			form.person = null;
			form.number = null;
		}
	}
}