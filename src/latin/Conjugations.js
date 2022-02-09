import * as FormTypes from "../api/FormTypes.js";
import Conjugation from "./Conjugation.js";

export const INVARIANT_SUFFIX_MAX_AMOUNT = 6;

export default class Conjugations {
  static INVARIANT_SUFFIXES = new Map()
    .set(FormTypes.IND_IMPERF_ACT,  ["am",    "as",    "at",    "amus",    "atis",    "ant"])
    .set(FormTypes.IND_IMPERF_PASS, ["bar",   "baris", "batur", "bamur",   "bamini",  "bantur"])
    .set(FormTypes.IND_PERF_ACT,    ["i",     "isti",  "it",    "imus",    "istis",   "erunt"])
    .set(FormTypes.IND_PERF_PASS,   ["sum",   "es",    "est",   "sumus",   "estis",   "sunt"])
    .set(FormTypes.IND_PLUP_ACT,    ["eram",  "eras",  "erat",  "eramus",  "eratis",  "erant"])
    .set(FormTypes.IND_PLUP_PASS,   ["eram",  "eras",  "erat",  "eramus",  "eratis",  "erant"])
    .set(FormTypes.IND_FUTP_ACT,    ["eor",   "eris",  "erit",  "erimus",  "eritis",  "erint"])
    .set(FormTypes.IND_FUTP_PASS,   ["eor",   "eris",  "erit",  "erimus",  "eritis",  "erint"])
    .set(FormTypes.SJV_PRES_ACT,    ["m",     "s",     "t",     "mus",     "tis",     "nt"])
    .set(FormTypes.SJV_PRES_PASS,   ["r",     "ris",   "tur",   "mur",     "mini",    "ntur"])
    .set(FormTypes.SJV_IMPERF_ACT,  ["em",    "es",    "et",    "emus",    "etis",    "ent"])
    .set(FormTypes.SJV_IMPERF_PASS, ["rer",   "reris", "retur", "remur",   "remini",  "rentur"])
    .set(FormTypes.SJV_PERF_ACT,    ["erim",  "eris",  "erit",  "erimus",  "eritis",  "erint"])
    .set(FormTypes.SJV_PERF_PASS,   ["sim",   "sis",   "sit",   "simus",   "sitis",   "sint"])
    .set(FormTypes.SJV_PLUP_ACT,    ["issem", "isses", "isset", "issemus", "issetis", "issent"])
    .set(FormTypes.SJV_PLUP_PASS,   ["essem", "esses", "esset", "essemus", "essetis", "essent"])
    .set(FormTypes.INF_PERF_ACT,    ["isse"])
    .set(FormTypes.INF_PERF_PASS,   ["esse"])
    .set(FormTypes.INF_FUT_PASS,    ["iri"]);  
  
  static FIRST_CONJUGATION = new Conjugation(
    FormTypes.IND_PRES_ACT,    "o,    as,     at,     amus,   atis,    ant",
    FormTypes.IND_PRES_PASS,   "or,   aris,   atur,   amur,   amini,   antur",
    FormTypes.IND_IMPERF_ACT,  "ab",  // +PERSONAL
    FormTypes.IND_IMPERF_PASS, "a",   // +PERSONAL
    FormTypes.IND_FUT_ACT,     "abo,  abis,   abit,   abimus,  abitis,  abunt", 
    FormTypes.IND_FUT_PASS,    "abor, aberis, abitur, abimur,  abimini, abuntur",

    FormTypes.SJV_PRES_ACT,    "e",
    FormTypes.SJV_PRES_PASS,   "e",
    FormTypes.SJV_IMPERF_ACT,  "ar",
    FormTypes.SJV_IMPERF_PASS, "a",
    
    FormTypes.IMP_PRES_ACT,    "-,a,-,-,ate,-",
    FormTypes.IMP_PRES_PASS,   "-,are,are,-,amini,amini",
    FormTypes.IMP_FUT_ACT,     "-,ato,ato,-,atote,ant",
    FormTypes.IMP_FUT_PASS,    "-,ator,ator,-,antor,antor",
  
    FormTypes.INF_PRES_PASS,   "ari",
    FormTypes.INF_PERF_ACT,    "isse",
    FormTypes.INF_PERF_PASS,   "esse",
    FormTypes.INF_FUT_ACT,     "esse",
    
    FormTypes.PTCP_PRES_ACT,   "ans",
    FormTypes.PTCP_FUT_PASS,   "and",
  null);         
          
  static SECOND_CONJUGATION = new Conjugation(
    FormTypes.IND_PRES_ACT,    "eo,   es,     et,     emus,   etis,   ent" ,
    FormTypes.IND_PRES_PASS,   "eor,  eris,   etur,   emur,   emini,  entur", 
    FormTypes.IND_IMPERF_ACT,  "eb",  // +Personal
    FormTypes.IND_IMPERF_PASS, "e",   // +Personal
    FormTypes.IND_FUT_ACT,     "ebo,  ebis,   ebit,   ebimus, ebitis,  ebunt",
    FormTypes.IND_FUT_PASS,    "ebor, eberis, ebitur, ebimur, ebimini, ebuntur",
    
    FormTypes.SJV_PRES_ACT,    "ea",
    FormTypes.SJV_PRES_PASS,   "ea",
    FormTypes.SJV_IMPERF_ACT,  "er",
    FormTypes.SJV_IMPERF_PASS, "e",
    
    FormTypes.IMP_PRES_ACT,    "-,e,-,-,ete,-",
    FormTypes.IMP_PRES_PASS,   "-,ere,ere,-,emini,emini",
    FormTypes.IMP_FUT_ACT,     "-,eto,eto,-,etote,ento",
    FormTypes.IMP_FUT_PASS,    "-,etor,etor,-,entor,entor",
    
    FormTypes.INF_PRES_PASS,  "eri",

    FormTypes.PTCP_PRES_ACT,  "ens",
    FormTypes.PTCP_FUT_PASS,  "end",
  null);

  static THIRD_CONJUGATION = new Conjugation(
    FormTypes.IND_PRES_ACT,    "o,   is,   it,   imus, itis,  unt" ,
    FormTypes.IND_PRES_PASS,   "or,  eris, itur, imur, imini, untur",
    FormTypes.IND_IMPERF_ACT,  "eb", 
    FormTypes.IND_IMPERF_PASS, "e",  
    FormTypes.IND_FUT_ACT,     "am,  es,   et,   emus, etis,  ent",
    FormTypes.IND_FUT_PASS,    "ar,  eris, etur, emur, emini, euntur", 
    FormTypes.SJV_PRES_ACT,    "a",
    FormTypes.SJV_PRES_PASS,   "a",
    FormTypes.SJV_IMPERF_ACT,  "er",
    FormTypes.SJV_IMPERF_PASS, "e",
    
    FormTypes.IMP_PRES_ACT,    "-,e,-,-,ite,-",
    FormTypes.IMP_PRES_PASS,   "-,ere,ere,-,imini,imini",
    FormTypes.IMP_FUT_ACT,     "-,ito,ito,-,itote,unto",
    FormTypes.IMP_FUT_PASS,    "-,itor,itor,-,untor,untor",

    FormTypes.INF_PRES_PASS,   "i",

    FormTypes.PTCP_PRES_ACT,   "ens",
    FormTypes.PTCP_FUT_PASS,   "end",
  null);

  static FOURTH_CONJUGATION = new Conjugation(
    FormTypes.IND_PRES_ACT,    "o,  s,    t,    mus,  tis,   unt",
    FormTypes.IND_PRES_PASS,   "or, ris,  tur,  mur,  mini,  untur", 
    FormTypes.IND_IMPERF_ACT,  "eb", 
    FormTypes.IND_IMPERF_PASS, "e",  
    FormTypes.IND_FUT_ACT,     "am, es,   et,   emus, etis,  ent", 
    FormTypes.IND_FUT_PASS,    "ar, eris, etur, emur, emini, euntur", 
    FormTypes.SJV_PRES_ACT,    "a",
    FormTypes.SJV_PRES_PASS,   "a",
    FormTypes.SJV_IMPERF_ACT,  "r",
    FormTypes.SJV_IMPERF_PASS, "",
    FormTypes.IMP_PRES_ACT,    "-,,-,-,te,-",
    FormTypes.IMP_PRES_PASS,   "-,re,re,-,mini,mini",
    FormTypes.IMP_FUT_ACT,     "-,to,to,-,tote,unto",
    FormTypes.IMP_FUT_PASS,    "-,tor,tor,-,untor,untor",
    FormTypes.INF_PRES_PASS,   "ri",

    FormTypes.PTCP_PRES_ACT,   "ens",
    FormTypes.PTCP_FUT_PASS,   "end",
  null);

  static THIRD_CONJUGATION_I_STEM = new Conjugation(
    FormTypes.IND_PRES_ACT,    "io,  is,    it,    imus,  itis,   iunt",
    FormTypes.IND_PRES_PASS,   "ior, eris,  itur,  imur,  imini,  iuntur",
    FormTypes.IND_IMPERF_ACT,  "ieb",
    FormTypes.IND_IMPERF_PASS, "ie",
    FormTypes.IND_FUT_ACT,     "iam, ies,   iet,   iemus, ietis,  ient",
    FormTypes.IND_FUT_PASS,    "iar, ieris, ietur, iemur, iemini, euntur", 
    FormTypes.SJV_PRES_ACT,    "ia",
    FormTypes.SJV_PRES_PASS,   "ia",
    FormTypes.SJV_IMPERF_ACT,  "er",
    FormTypes.SJV_IMPERF_PASS, "e",
    FormTypes.IMP_PRES_ACT,    "-,e,-,-,ite,-",
    FormTypes.IMP_PRES_PASS,   "-,ere,ere,-,imini,imini",
    FormTypes.IMP_FUT_ACT,     "-,ito,ito,-,itote,iunto",
    FormTypes.IMP_FUT_PASS,    "-,itor,itor,-,iuntor,iuntor",

    FormTypes.INF_PRES_PASS,   "i",
    FormTypes.PTCP_PRES_ACT,   "iens",
    FormTypes.PTCP_FUT_PASS,   "iend",
  null);

  static ESSE = new Conjugation(
    FormTypes.IND_PRES_ACT,   "sum, es,   est,  sumus,  estis,  sunt",
    FormTypes.IND_IMPERF_ACT, "er",
    FormTypes.IND_FUT_ACT,    "ero, eris, erit, erimus, eritis, erunt", 
    FormTypes.SJV_PRES_ACT,   "si",
    FormTypes.SJV_IMPERF_ACT, "ess",
    FormTypes.INF_PRES_ACT,   "esse",
    FormTypes.IMP_PRES_ACT,   "-,es,-,-,este,-",
    FormTypes.IMP_FUT_ACT,    "-,esto,esto,-,estote,sunto",
  null);
  
  static POSSE = new Conjugation(
    FormTypes.IND_PRES_ACT,   "possum, potes,   potest,  possumus,  potestis,  possunt",
    FormTypes.IND_FUT_ACT,    "potero, poteris, poterit, poterimus, poteritis, poterunt",
    FormTypes.SJV_PRES_ACT,   "possi",
    FormTypes.SJV_IMPERF_ACT, "poss",
    FormTypes.IMP_PRES_ACT,   "-,      potes,   -,        -,        poteste,    -",
  null);
  
  static FERRE = new Conjugation(
    FormTypes.IND_PRES_ACT,    "fero,  fers,    fert,    ferimus, fertis,   ferunt",
    FormTypes.IND_PRES_PASS,   "feror, ferris,  fertur,  ferimur, ferimini, feruntur",
    FormTypes.IND_IMPERF_PASS, "fere", 
    FormTypes.IND_FUT_ACT,     "feram, feres,   feret,   feremus, feretis,  ferent", 
    FormTypes.IND_FUT_PASS,    "ferar, fereris, feretur, feremur, feremini, fereuntur",
    FormTypes.SJV_PRES_ACT,    "fera",
    FormTypes.SJV_PRES_PASS,   "fera",
    FormTypes.SJV_IMPERF_ACT,  "ferr",
    FormTypes.SJV_IMPERF_ACT,  "fer",
    FormTypes.IMP_PRES_ACT,    "-,fer,-,-,ferte,-",
    FormTypes.INF_PRES_PASS,   "ferri",
    FormTypes.IMP_FUT_ACT,     "-,ferto,ferto,-,fertote,ferunto",
  null);
     
  static VELLE = new Conjugation(
    FormTypes.IND_PRES_ACT,   "volo,  vis,   vult,  volumus, vultis,  volunt",
    FormTypes.IND_FUT_ACT,    "volam, voles, volet, volemus, voletis, volent",
    FormTypes.SJV_PRES_ACT,   "veli",
    FormTypes.SJV_IMPERF_ACT, "vell",
    FormTypes.IMP_PRES_ACT, "-,noli,-,-,nolite,-",
    
    FormTypes.PTCP_PRES_ACT, "velens",
    FormTypes.PTCP_FUT_PASS, "velend",
  null);
  
  static NOLLE = new Conjugation(
    FormTypes.IND_PRES_ACT,   "nolo,  non vis, non vult, nolumus, non vultis, nolunt",
    FormTypes.IND_FUT_ACT,    "nolam, noles,   nolet,    nolemus, noletis,    nolent", 
    FormTypes.SJV_PRES_ACT,   "noli",
    FormTypes.SJV_IMPERF_ACT, "noll",
    
    FormTypes.PTCP_PRES_ACT, "nolens",
    FormTypes.PTCP_FUT_PASS, "nolend",
  null);
  
  static MALLE = new Conjugation(
    FormTypes.IND_PRES_ACT,   "malo,  mavis, mavult, malumus, mavultis, malunt",
    FormTypes.IND_FUT_ACT,    "malam, males, malet,  malemus, maletis,  malent",
    FormTypes.SJV_PRES_ACT,   "mali",
    FormTypes.SJV_IMPERF_ACT, "mall",
    
    FormTypes.PTCP_PRES_ACT, "malens",
    FormTypes.PTCP_FUT_PASS, "malend",
    null);
  
  static IRE = new Conjugation(
    FormTypes.IND_PRES_ACT,   "eo,  is,   it,   imus,   itis,   eunt",
    FormTypes.IND_FUT_ACT,    "ibo, ibis, ibit, ibimus, ibitis, ibunt",
    FormTypes.IND_PERF_ACT,   "ii,  isti, iit,  iimus,  istis,  ierunt",
    FormTypes.SJV_PRES_ACT,   "ea",
    FormTypes.SJV_IMPERF_ACT, "ir",
    
    FormTypes.PTCP_PRES_ACT, "iens",
    FormTypes.PTCP_FUT_PASS, "iend",
  null);
}
