package org.kobjects.nlp.latin;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.Genus;
import org.kobjects.nlp.api.GenusVerbi;
import org.kobjects.nlp.api.Modus;
import org.kobjects.nlp.api.Numerus;
import org.kobjects.nlp.api.Person;
import org.kobjects.nlp.api.Tempus;

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

		form.setModus(Modus.INDIKATIV);
		form.setTempus(Tempus.PRAESENS);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add15("o,as,at,amus,atis,ant", "eo,es,et,emus,etis,ent", "o,is,it,imus,itis,unt", "o,s,t,mus,tis,unt",
				"io,is,it,imus,itis,iunt",

				"sum,es,est,sumus,estis,sunt", "possum,potes,potest,possumus,potestis,possunt",
				"fero,fers,fert,ferimus,fertis,ferunt", "volo,vis,vult,volumus,vultis,volunt",
				"nolo,non vis,non vult,nolumus,non vultis,nolunt", "malo,mavis,mavult,malumus,mavultis,malunt",
				"eo,is,it,imus,itis,eunt");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add15("or,aris,atur,amur,amini,antur", "eor,eris,etur, emur,emini,entur", "or,eris,itur,imur,imini,untur",
				"or,ris,tur,mur,mini,untur", "ior,eris,itur,imur,imini,iuntur",

				"#", "#", "feror,ferris,fertur,ferimur,ferimini,feruntur", "#", "#", "#", "#");

		form.setTempus(Tempus.IMPERFEKT);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add12("ab,eb,eb,eb,ieb,er,poter,fereb,voleb,noleb,maleb,ib", "am,as,at,amus,atis,ant");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add12("a,e,e,e,ie,#,#,fere,#,#,#,#", "bar,baris,batur,bamur,bamini,bantur");

		form.setTempus(Tempus.PERFEKT);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		if (conjugation == 12) {
			add12("", "ii,isti,iit,iimus,istis,ierunt");
		} else {
			add2("i,isti,it,imus,istis,erunt");
		}
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add3("sum,es,est,sumus,estis,sunt");

		form.setTempus(Tempus.PLUSQUAMPERFEKT);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add2("eram,eras,erat,eramus,eratis,erant");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add3("eram,eras,erat,eramus,eratis,erant");

		form.setTempus(Tempus.FUTUR_1);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add15(	"abo,abis,abit,abimus,abitis,abunt", 
				"ebo,ebis,ebit,ebimus,ebitis,ebunt",
				"am,es,et,emus,etis,ent",
				"am,es,et,emus,etis,ent", 
				"iam,ies,iet,iemus,ietis,ient",

				"ero,eris,erit,erimus,eritis,erunt", "potero,poteris,poterit,poterimus,poteritis,poterunt",
				"feram,feres,feret,feremus,feretis,ferent", "volam,voles,volet,volemus,voletis,volent",
				"nolam,noles,nolet,nolemus,noletis,nolent", "malam,males,malet,malemus,maletis,malent",
				"ibo,ibis,ibit,ibimus,ibitis,ibunt");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add15("abor,aberis,abitur,abimur,abimini,abuntur", "ebor,eberis,ebitur,ebimur,ebimini,ebuntur",
				"ar,eris,etur,emur,emini,euntur", "ar,eris,etur,emur,emini,euntur",
				"iar,ieris,ietur,iemur,iemini,euntur", "#", "#", "ferar,fereris,feretur,feremur,feremini,fereuntur",
				"#", "#", "#", "#");

		form.setTempus(Tempus.FUTUR_2);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add2("ero,eris,erit,erimus,eritis,erint");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add3("ero,eris,erit,erimus,eritis,erunt");

		form.setModus(Modus.KONJUNKTIV);
		form.setTempus(Tempus.PRAESENS);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add12("e,ea,a,a,ia,si,possi,fera,veli,noli,mali,ea", "m,s,t,mus,tis,nt");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add12("e,ea,a,a,ia,#,#,fera,#,#,#,#", "r,ris,tur,mur,mini,ntur");

		form.setTempus(Tempus.IMPERFEKT);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add12("ar,er,er,r,er,ess,poss,ferr,vell,noll,mall,ir", "em,es,et,emus,etis,ent");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add12("a,e,e,,e,#,#,fer,#,#,#,#", "rer,reris,retur,remur,remini,rentur");

		form.setTempus(Tempus.PERFEKT);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add2("erim,eris,erit,erimus,eritis,erint");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add3("sim,sis,sit,simus,sitis,sint");

		form.setTempus(Tempus.PLUSQUAMPERFEKT);
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add2("issem,isses,isset,issemus,issetis,issent");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add3("essem,esses,esset,essemus,essetis,essent");

		form.modus = Modus.IMPERATIV;

		form.tempus = Tempus.PRAESENS;
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add15("#,a,#,#,ate,#", "#,e,#,#,ete,#", "#,e,#,#,ite,#", "#,,#,#,te,#", "#,e,#,#,ite,#", "#,es,#,#,este,#",
				"#,potes,#,#,poteste,#", "#,fer,#,#,ferte,#", "#,noli,#,#,nolite,#", "#", "#", "#");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add15("#,are,are,#,amini,amini", "#,ere,ere,#,emini,emini", "#,ere,ere,#,imini,imini", "#,re,re,#,mini,mini",
				"#,ere,ere,#,imini,imini", "#", "#", "#", "#", "#", "#", "#");

		form.tempus = Tempus.FUTUR_1;
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add15("#,ato,ato,#,atote,anto", "#,eto,eto,#,etote,ento", "#,ito,ito,#,itote,unto", "#,to,to,#,tote,unto",
				"#,ito,ito,#,itote,iunto", "#,esto,esto,#,estote,sunto", "#", "#,ferto,ferto,#,fertote,ferunto", "#",
				"#", "#", "#");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add15("#,ator,ator,#,antor,antor", "#,etor,etor,#,entor,entor", "#,itor,itor,#,untor,untor",
				"#,tor,tor,#,untor,untor", "#,itor,itor,#,iuntor,iuntor", "#", "#", "#", "#", "#", "#", "#");

		form.modus = Modus.INFINITIV;
		form.tempus = Tempus.PRAESENS;
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add15("are", "ere", "ere", "re", "ere", "esse", "posse", "ferre", "velle", "nolle", "malle", "ire");
		form.setGenusVerbi(GenusVerbi.PASSIV);
		add15("ari", "eri", "i", "ri", "i", "#", "#", "ferri", "#", "#", "#", "#");
		form.tempus = Tempus.PERFEKT;
		form.setGenusVerbi(GenusVerbi.AKTIV);

		form.person = null;
		form.numerus = null;
		insertForm(stem2 + "isse");

		form.setGenusVerbi(GenusVerbi.PASSIV);
		form.genus = Genus.MASCULINUM;
		insertForm(stem3 + "um esse");
		form.genus = Genus.FEMININUM;
		insertForm(stem3 + "am esse");
		form.genus = Genus.NEUTRUM;
		insertForm(stem3 + "um esse");

		form.modus = Modus.GERUNDIUM;
		form.tempus = null;
		form.genus = null;
		form.genusVerbi = null;
		add15("andi", "endi", "endi", "endi", "iendi", "#", "#", "#", "#", "#", "#", "eundi");

		form.modus = Modus.GERUNDIVUM;
		form.genus = Genus.MASCULINUM;
		add15("andus", "endus", "endus", "endus", "iendus", "#", "#", "#", "#", "#", "#", "#");
		form.genus = Genus.FEMININUM;
		add15("anda", "enda", "enda", "enda", "ienda", "#", "#", "#", "#", "#", "#", "#");

		form.genus = Genus.NEUTRUM;
		add15("andum", "endum", "endum", "endum", "iendum", "#", "#", "#", "#", "#", "#", "#");

		form.modus = Modus.SUPINUM;
		form.genus = null;
		insertForm(stem3 + "um");

		form.modus = Modus.PARTIZIP;
		form.tempus = Tempus.PRAESENS;
		form.setGenusVerbi(GenusVerbi.AKTIV);
		add12("a,e,e,e,ie,#,#,#,velens,nolens,#,ie", "ns");

		form.tempus = Tempus.PERFEKT;
		form.setGenusVerbi(GenusVerbi.PASSIV);

		form.genus = Genus.MASCULINUM;
		insertForm(stem3 + "us");
		form.genus = Genus.FEMININUM;
		insertForm(stem3 + "a");
		form.genus = Genus.NEUTRUM;
		insertForm(stem3 + "um");

		form.tempus = Tempus.FUTUR_1;
		form.setGenusVerbi(GenusVerbi.AKTIV);

		form.genus = Genus.MASCULINUM;
		insertForm(stem3 + "urus");
		form.genus = Genus.FEMININUM;
		insertForm(stem3 + "ura");
		form.genus = Genus.NEUTRUM;
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
		form.setGenus(null);
		int index = 0;
		for (int n = 0; n < 2; n++) {
			form.setNumerus(Latin.NUMERI[n]);
			for (Person person : Person.values()) {
				form.setPerson(person);
				insertForm(stem2 + parts[index++]);
			}
		}
		form.person = null;
		form.numerus = null;
	}

	void add3(String s) {
		add3(s.split(","));
	}
	
	// Genus, numerus, person
	void add3(String[] parts) {
		if (parts.length != 6) {
			throw new RuntimeException("6 parts expected for add3 " + Arrays.toString(parts));
		}
		for (Genus genus : Latin.GENERA) {
			int index = 0;
			form.genus = genus;
			for (Numerus numerus : Latin.NUMERI) {
				form.numerus = numerus;
				String s1;
				if (form.numerus == Numerus.SINGULAR) {
					switch (form.genus) {
					case MASCULINUM:
						s1 = "us";
						break;
					case FEMININUM:
						s1 = "a";
						break;
					case NEUTRUM:
						s1 = "um";
						break;
					default:
						throw new RuntimeException();
					}
				} else {
					switch (form.genus) {
					case MASCULINUM:
						s1 = "i";
						break;
					case FEMININUM:
						s1 = "ae";
						break;
					case NEUTRUM:
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
		form.genus = null;
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
			form.numerus = null;
			form.person = null;
			insertForm(stem1 + s1 + parts[0]);
		} else {
			for (int n = 0; n < 2; n++) {
				form.numerus = n == 0 ? Numerus.SINGULAR : Numerus.PLURAL;
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
			form.numerus = null;
		}
	}
}