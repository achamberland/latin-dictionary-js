package org.kobjects.nlp.latin;

import java.util.Map;

import org.kobjects.nlp.api.Form;
import org.kobjects.nlp.api.MapBuilder;

public class Conjugations {
  
  static final Map<Form, String[]> INVARIANT_SUFFIXES = new MapBuilder<Form, String[]>()

      .put(Form.IND_IMPERF_ACT,  new String[] {"am",    "as",    "at",    "amus",    "atis",    "ant"})
      .put(Form.IND_IMPERF_PASS, new String[] {"bar",   "baris", "batur", "bamur",   "bamini",  "bantur"})
      .put(Form.IND_PERF_ACT,    new String[] {"i",     "isti",  "it",    "imus",    "istis",   "erunt"})
      .put(Form.IND_PERF_PASS,   new String[] {"sum",   "es",    "est",   "sumus",   "estis",   "sunt"})
      .put(Form.IND_PLUP_ACT,    new String[] {"eram",  "eras",  "erat",  "eramus",  "eratis",  "erant"})
      .put(Form.IND_PLUP_PASS,   new String[] {"eram",  "eras",  "erat",  "eramus",  "eratis",  "erant"})
      .put(Form.IND_FUTP_ACT,    new String[] {"eor",   "eris",  "erit",  "erimus",  "eritis",  "erint"})
      .put(Form.IND_FUTP_PASS,   new String[] {"eor",   "eris",  "erit",  "erimus",  "eritis",  "erint"})
      .put(Form.SJV_PRES_ACT,    new String[] {"m",     "s",     "t",     "mus",     "tis",     "nt"})
      .put(Form.SJV_PRES_PASS,   new String[] {"r",     "ris",   "tur",   "mur",     "mini",    "ntur"})
      .put(Form.SJV_IMPERF_ACT,  new String[] {"em",    "es",    "et",    "emus",    "etis",    "ent"})
      .put(Form.SJV_IMPERF_PASS, new String[] {"rer",   "reris", "retur", "remur",   "remini",  "rentur"})
      .put(Form.SJV_PERF_ACT,    new String[] {"erim",  "eris",  "erit",  "erimus",  "eritis",  "erint"})
      .put(Form.SJV_PERF_PASS,   new String[] {"sim",   "sis",   "sit",   "simus",   "sitis",   "sint"})
      .put(Form.SJV_PLUP_ACT,    new String[] {"issem", "isses", "isset", "issemus", "issetis", "issent"})
      .put(Form.SJV_PLUP_PASS,   new String[] {"essem", "esses", "esset", "essemus", "essetis", "essent"})
      .put(Form.INF_PERF_ACT,    new String[] {"isse"})
      .put(Form.INF_PERF_PASS,   new String[] {"esse"})
      .put(Form.INF_FUT_PASS,    new String[] {"iri"})
      .build();
  
  
  static final Conjugation FIRST_CONJUGATION = new Conjugation(
      Form.IND_PRES_ACT,    "o,    as,     at,     amus,   atis,    ant",
      Form.IND_PRES_PASS,   "or,   aris,   atur,   amur,   amini,   antur",
      Form.IND_IMPERF_ACT,  "ab",  // +PERSONAL
      Form.IND_IMPERF_PASS, "a",   // +PERSONAL
      Form.IND_FUT_ACT,     "abo,  abis,   abit,   abimus,  abitis,  abunt", 
      Form.IND_FUT_PASS,    "abor, aberis, abitur, abimur,  abimini, abuntur",

      Form.SJV_PRES_ACT,    "e",
      Form.SJV_PRES_PASS,   "e",
      Form.SJV_IMPERF_ACT,  "ar",
      Form.SJV_IMPERF_PASS, "a",
      
      Form.IMP_PRES_ACT,    "-,a,-,-,ate,-",
      Form.IMP_PRES_PASS,   "-,are,are,-,amini,amini",
      Form.IMP_FUT_ACT,     "-,ato,ato,-,atote,ant",
      Form.IMP_FUT_PASS,    "-,ator,ator,-,antor,antor",
    
      
      Form.INF_PRES_PASS,   "ari",
      Form.INF_PERF_ACT,    "isse",
      Form.INF_PERF_PASS,   "esse",
      Form.INF_FUT_ACT,     "esse",
      
      Form.PTCP_PRES_ACT,   "ans",
      Form.PTCP_FUT_PASS,   "and",
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
      
      Form.IMP_PRES_ACT,    "-,e,-,-,ete,-",
      Form.IMP_PRES_PASS,   "-,ere,ere,-,emini,emini",
      Form.IMP_FUT_ACT,     "-,eto,eto,-,etote,ento",
      Form.IMP_FUT_PASS,    "-,etor,etor,-,entor,entor",
      
      Form.INF_PRES_PASS,  "eri",

      Form.PTCP_PRES_ACT,  "ens",
      Form.PTCP_FUT_PASS,  "end",

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
      
      Form.IMP_PRES_ACT,    "-,e,-,-,ite,-",
      Form.IMP_PRES_PASS,   "-,ere,ere,-,imini,imini",
      Form.IMP_FUT_ACT,     "-,ito,ito,-,itote,unto",
      Form.IMP_FUT_PASS,    "-,itor,itor,-,untor,untor",

      Form.INF_PRES_PASS,   "i",

      Form.PTCP_PRES_ACT,   "ens",
      Form.PTCP_FUT_PASS,   "end",

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
      Form.IMP_PRES_ACT,    "-,,-,-,te,-",
      Form.IMP_PRES_PASS,   "-,re,re,-,mini,mini",
      Form.IMP_FUT_ACT,     "-,to,to,-,tote,unto",
      Form.IMP_FUT_PASS,    "-,tor,tor,-,untor,untor",
      Form.INF_PRES_PASS,   "ri",

      Form.PTCP_PRES_ACT,   "ens",
      Form.PTCP_FUT_PASS,   "end",

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
      Form.SJV_IMPERF_PASS, "e",
      Form.IMP_PRES_ACT,    "-,e,-,-,ite,-",
      Form.IMP_PRES_PASS,   "-,ere,ere,-,imini,imini",
      Form.IMP_FUT_ACT,     "-,ito,ito,-,itote,iunto",
      Form.IMP_FUT_PASS,    "-,itor,itor,-,iuntor,iuntor",

      Form.INF_PRES_PASS,   "i",
      Form.PTCP_PRES_ACT,   "iens",
      Form.PTCP_FUT_PASS,   "iend",

      null);


  static final Conjugation ESSE = new Conjugation(
      Form.IND_PRES_ACT,   "sum, es,   est,  sumus,  estis,  sunt",
      Form.IND_IMPERF_ACT, "er",
      Form.IND_FUT_ACT,    "ero, eris, erit, erimus, eritis, erunt", 
      Form.SJV_PRES_ACT,   "si",
      Form.SJV_IMPERF_ACT, "ess",
      Form.INF_PRES_ACT,   "esse",
      Form.IMP_PRES_ACT,   "-,es,-,-,este,-",
      Form.IMP_FUT_ACT,    "-,esto,esto,-,estote,sunto",
      
      null);
  
  static final Conjugation POSSE = new Conjugation(
      Form.IND_PRES_ACT,   "possum, potes,   potest,  possumus,  potestis,  possunt",
      Form.IND_FUT_ACT,    "potero, poteris, poterit, poterimus, poteritis, poterunt",
      Form.SJV_PRES_ACT,   "possi",
      Form.SJV_IMPERF_ACT, "poss",
      Form.IMP_PRES_ACT,   "-,      potes,   -,        -,        poteste,    -",
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
      Form.IMP_PRES_ACT, "-,fer,-,-,ferte,-",
      Form.INF_PRES_PASS,    "ferri",
      Form.IMP_FUT_ACT, "-,ferto,ferto,-,fertote,ferunto",
            
     
      null);
     
  static final Conjugation VELLE = new Conjugation(
      Form.IND_PRES_ACT,   "volo,  vis,   vult,  volumus, vultis,  volunt",
      Form.IND_FUT_ACT,    "volam, voles, volet, volemus, voletis, volent",
      Form.SJV_PRES_ACT,   "veli",
      Form.SJV_IMPERF_ACT, "vell",
      Form.IMP_PRES_ACT, "-,noli,-,-,nolite,-",
      
      Form.PTCP_PRES_ACT, "velens",
      Form.PTCP_FUT_PASS, "velend",

      null);
  
  static final Conjugation NOLLE = new Conjugation(
      Form.IND_PRES_ACT,   "nolo,  non vis, non vult, nolumus, non vultis, nolunt",
      Form.IND_FUT_ACT,    "nolam, noles,   nolet,    nolemus, noletis,    nolent", 
      Form.SJV_PRES_ACT,   "noli",
      Form.SJV_IMPERF_ACT, "noll",
      
      Form.PTCP_PRES_ACT, "nolens",
      Form.PTCP_FUT_PASS, "nolend",
      null);
  
  static final Conjugation MALLE = new Conjugation(
      Form.IND_PRES_ACT,   "malo,  mavis, mavult, malumus, mavultis, malunt",
      Form.IND_FUT_ACT,    "malam, males, malet,  malemus, maletis,  malent",
      Form.SJV_PRES_ACT,   "mali",
      Form.SJV_IMPERF_ACT, "mall",
      
      Form.PTCP_PRES_ACT, "malens",
      Form.PTCP_FUT_PASS, "malend",
      null);
  
  static final Conjugation IRE = new Conjugation(
      Form.IND_PRES_ACT,   "eo,  is,   it,   imus,   itis,   eunt",
      Form.IND_FUT_ACT,    "ibo, ibis, ibit, ibimus, ibitis, ibunt",
      Form.IND_PERF_ACT,   "ii,  isti, iit,  iimus,  istis,  ierunt",
      Form.SJV_PRES_ACT,   "ea",
      Form.SJV_IMPERF_ACT, "ir",
      
      Form.PTCP_PRES_ACT, "iens",
      Form.PTCP_FUT_PASS, "iend",
      null);
}
