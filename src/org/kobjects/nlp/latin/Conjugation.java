package org.kobjects.nlp.latin;

import java.util.LinkedHashMap;
import java.util.Map;

import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.FormBuilder;
import org.kobjects.nlp.api.MapBuilder;
import org.kobjects.nlp.api.Number;
import org.kobjects.nlp.api.Person;

class Conjugation {
  static final Map<Form, String[]> PERSONAL_SUFFIXES = new MapBuilder<Form, String[]>()
      .put(Form.IND_IMPERF_ACT,  new String[] {"am",  "as",    "at",    "amus",  "atis",   "ant"})
      .put(Form.IND_IMPERF_PASS, new String[] {"bar", "baris", "batur", "bamur", "bamini", "bantur"})
      .put(Form.SJV_PRES_ACT,    new String[] {"m",   "s",     "t",     "mus",   "tis",    "nt"})
      .put(Form.SJV_PRES_PASS,   new String[] {"r",   "ris",   "tur",   "mur",   "mini",   "ntur"})
      .put(Form.SJV_IMPERF_ACT,  new String[] {"em",  "es",    "et",    "emus",  "etis",   "ent"})
      .put(Form.SJV_IMPERF_PASS, new String[] {"rer", "reris", "retur", "remur", "remini", "rentur"}).build();
  
  static final Conjugation FIRST_CONJUGATION = new Conjugation(
      Form.IND_PRES_ACT,    "o,    as,     at,     amus,   atis,    ant",
      Form.IND_PRES_PASS,   "or,   aris,   atur,   amur,   amini,   antur",
      
      Form.IND_IMPERF_ACT,  "ab",  // +PERSONAL
      Form.IND_IMPERF_PASS, "a",   // +PERSONAL

      Form.IND_FUT_ACT,     "abo,  abis,   abit,   abimus,  abitis,  abunt", 
      Form.IND_FUT_PASS,    "abor, aberis, abitur, abimur,  abimini, abuntur",
      Form.IND_PERF_ACT,    "i,    isti,   it,     imust,   istis,   erunt",
      Form.IND_PLUP_ACT,    "eram, eras,   erat,   eramus,  eratis,  erant",
      Form.IND_FUTP_ACT,    "vero, veris,  verit,  verimus, veritis, verint",
      Form.SJV_PRES_ACT,    "e",
      Form.SJV_PRES_PASS,   "e",
      Form.SJV_IMPERF_ACT,  "ar",
      Form.SJV_IMPERF_PASS, "a",
      null);
                       
          
  static final Conjugation SECOND_CONJUGATION = new Conjugation(
      Form.IND_PRES_ACT,    "eo,   es,     et,     emus,   etis,   ent" ,
      Form.IND_PRES_PASS,   "eor,  eris,   etur,   emur,   emini,  entur", 
      Form.IND_IMPERF_ACT,  "eb",  // +Personal
      Form.IND_IMPERF_PASS, "e",   // +Personal
      Form.IND_FUT_ACT,     "ebo,  ebis,   ebit,   ebimus, ebitis,  ebunt",
      Form.IND_FUT_PASS,    "ebor, eberis, ebitur, ebimur, ebimini, ebuntur",
      Form.SJV_PRES_ACT,    "ea",
      Form.SJV_PRES_PASS,   "ea",
      Form.SJV_IMPERF_ACT,  "er",
      Form.SJV_IMPERF_PASS, "e",
      null);

  static final Conjugation THIRD_CONJUGATION = new Conjugation(
      Form.IND_PRES_ACT,    "o,   is,   it,   imus, itis,  unt" ,
      Form.IND_PRES_PASS,   "or,  eris, itur, imur, imini, untur",
      Form.IND_IMPERF_ACT,  "eb", 
      Form.IND_IMPERF_PASS, "e",  
      Form.IND_FUT_ACT,     "am,  es,   et,   emus, etis,  ent",
      Form.IND_FUT_PASS,    "ar,  eris, etur, emur, emini, euntur", 
      Form.SJV_PRES_ACT,    "a",
      Form.SJV_PRES_PASS,   "a",
      Form.SJV_IMPERF_ACT,  "er",
      Form.SJV_IMPERF_PASS, "e",
      null);

  static final Conjugation FOURTH_CONJUGATION = new Conjugation(
      Form.IND_PRES_ACT,    "o,  s,    t,    mus,  tis,   unt",
      Form.IND_PRES_PASS,   "or, ris,  tur,  mur,  mini,  untur", 
      Form.IND_IMPERF_ACT,  "eb", 
      Form.IND_IMPERF_PASS, "e",  
      Form.IND_FUT_ACT,     "am, es,   et,   emus, etis,  ent", 
      Form.IND_FUT_PASS,    "ar, eris, etur, emur, emini, euntur", 
      Form.SJV_PRES_ACT,    "a",
      Form.SJV_PRES_PASS,   "a",
      Form.SJV_IMPERF_ACT,  "r",
      Form.SJV_IMPERF_PASS, "",
      null);

  static final Conjugation THIRD_CONJUGATION_I_STEM = new Conjugation(
      Form.IND_PRES_ACT,    "io,  is,    it,    imus,  itis,   iunt",
      Form.IND_PRES_PASS,   "ior, eris,  itur,  imur,  imini,  iuntur",
      Form.IND_IMPERF_ACT,  "ieb",
      Form.IND_IMPERF_PASS, "ie",
      Form.IND_FUT_ACT,     "iam, ies,   iet,   iemus, ietis,  ient",
      Form.IND_FUT_PASS,    "iar, ieris, ietur, iemur, iemini, euntur", 
      Form.SJV_PRES_ACT,    "ia",
      Form.SJV_PRES_PASS,   "ia",
      Form.SJV_IMPERF_ACT,  "er",
      Form.SJV_IMPERF_PASS,  "e",
      null);


  static final Conjugation ESSE = new Conjugation(
      Form.IND_PRES_ACT,   "sum, es,   est,  sumus,  estis,  sunt",
      Form.IND_IMPERF_ACT, "er",
      Form.IND_FUT_ACT,    "ero, eris, erit, erimus, eritis, erunt", 
      Form.SJV_PRES_ACT,   "si",
      Form.SJV_IMPERF_ACT, "ess",
      null);
  
  static final Conjugation POSSE = new Conjugation(
      Form.IND_PRES_ACT,   "possum, potes,   potest,  possumus,  potestis,  possunt",
      Form.IND_FUT_ACT,    "potero, poteris, poterit, poterimus, poteritis, poterunt",
      Form.SJV_PRES_ACT,   "possi",
      Form.SJV_IMPERF_ACT, "poss",
      null);
  
  static final Conjugation FERRE = new Conjugation(
      Form.IND_PRES_ACT,    "fero,  fers,    fert,    ferimus, fertis,   ferunt",
      Form.IND_PRES_PASS,   "feror, ferris,  fertur,  ferimur, ferimini, feruntur",
      Form.IND_IMPERF_PASS, "fere", 
      Form.IND_FUT_ACT,     "feram, feres,   feret,   feremus, feretis,  ferent", 
      Form.IND_FUT_PASS,    "ferar, fereris, feretur, feremur, feremini, fereuntur",
      Form.SJV_PRES_ACT,    "fera",
      Form.SJV_PRES_PASS,   "fera",
      Form.SJV_IMPERF_ACT,  "ferr",
      Form.SJV_IMPERF_ACT,  "fer",
      null);
     
  static final Conjugation VOLE = new Conjugation(
      Form.IND_PRES_ACT,   "volo,  vis,   vult,  volumus, vultis,  volunt",
      Form.IND_FUT_ACT,    "volam, voles, volet, volemus, voletis, volent",
      Form.SJV_PRES_ACT,   "veli",
      Form.SJV_IMPERF_ACT, "vell",
      null);
  
  static final Conjugation NOLE = new Conjugation(
      Form.IND_PRES_ACT,   "nolo,  non vis, non vult, nolumus, non vultis, nolunt",
      Form.IND_FUT_ACT,    "nolam, noles,   nolet,    nolemus, noletis,    nolent", 
      Form.SJV_PRES_ACT,   "noli",
      Form.SJV_IMPERF_ACT, "noll",
      null);
  
  static final Conjugation MALE = new Conjugation(
      Form.IND_PRES_ACT,   "malo,  mavis, mavult, malumus, mavultis, malunt",
      Form.IND_FUT_ACT,    "malam, males, malet,  malemus, maletis,  malent",
      Form.SJV_PRES_ACT,   "mali",
      Form.SJV_IMPERF_ACT, "mall",
      null);
  
  static final Conjugation E = new Conjugation(
      Form.IND_PRES_ACT,   "eo,  is,   it,   imus,   itis,   eunt",
      Form.IND_FUT_ACT,    "ibo, ibis, ibit, ibimus, ibitis, ibunt",
      Form.SJV_PRES_ACT,   "ea",
      Form.SJV_IMPERF_ACT, "ir",
      null);
  
  final LinkedHashMap<Form, String> map = new LinkedHashMap<>();
  
  /** 
   * Expected parameters are alternating form instances and strings. 
   * The strings contain the suffixes for the sub-forms of the given forms.
   */
  Conjugation(Object... data) {
    for (int pos = 0; pos < data.length; pos += 2) {
      Form base = (Form) data[pos];
      if (base == null) {
        continue;
      }
      FormBuilder builder = new FormBuilder(base);
      String[] s = ((String) data[pos + 1]).split(",");
      for (int i = 0; i < s.length; i++) {
        s[i] = s[i].trim();
      }
      switch (builder.mood) {
      case INDICATIVE:
      case SUBJUNCTIVE:
        if (s.length == 1) {
          String[] forms = new String[6];
          for (int i = 0; i < forms.length; i++) {
            forms[i] = s[0] + PERSONAL_SUFFIXES.get(base)[i];
          }
          s = forms;
        }
        int i = 0;
        for (Number number : Number.values()) {
          builder.number = number;
          for (Person person : Person.values()) {
             builder.person = person;
             map.put(builder.build(), s[i++]); 
           }
         }
        break;
      default:
        throw new RuntimeException("Unsupported mood: " + builder.mood);
      }
    }
  }
  
  Map<Form,String> apply(String presentStem, String perfectActiveStem, String perfectPassiveStem) {
    LinkedHashMap<Form,String> result = new LinkedHashMap<Form,String>();
    for (Map.Entry<Form, String> entry : map.entrySet()) {
      result.put(entry.getKey(), presentStem + entry.getValue());
    }
    return result;
  }
  
}