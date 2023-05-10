import FormBuilder from "../models/FormBuilder.js";
import Mood from "./Mood.js";
import Tense from "./Tense.js";
import Voice from "./Voice.js";

export const IND_PRES_ACT = FormBuilder.of(Mood.INDICATIVE, Tense.PRESENT, Voice.ACTIVE);
export const IND_PRES_PASS = FormBuilder.of(Mood.INDICATIVE, Tense.PRESENT, Voice.PASSIVE);
export const IND_IMPERF_ACT = FormBuilder.of(Mood.INDICATIVE, Tense.IMPERFECT, Voice.ACTIVE);
export const IND_IMPERF_PASS = FormBuilder.of(Mood.INDICATIVE, Tense.IMPERFECT, Voice.PASSIVE);
export const IND_FUT_ACT = FormBuilder.of(Mood.INDICATIVE, Tense.FUTURE, Voice.ACTIVE);
export const IND_FUT_PASS = FormBuilder.of(Mood.INDICATIVE, Tense.FUTURE, Voice.PASSIVE);
export const IND_PERF_ACT = FormBuilder.of(Mood.INDICATIVE, Tense.PERFECT, Voice.ACTIVE);
export const IND_PERF_PASS = FormBuilder.of(Mood.INDICATIVE, Tense.PERFECT, Voice.PASSIVE);
export const IND_PLUP_ACT = FormBuilder.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
export const IND_PLUP_PASS = FormBuilder.of(Mood.INDICATIVE, Tense.PAST_PERFECT, Voice.PASSIVE);
export const IND_FUTP_ACT = FormBuilder.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.ACTIVE);
export const IND_FUTP_PASS = FormBuilder.of(Mood.INDICATIVE, Tense.FUTURE_PERFECT, Voice.PASSIVE);

export const SJV_PRES_ACT = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.ACTIVE);
export const SJV_PRES_PASS = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.PRESENT, Voice.PASSIVE);
export const SJV_IMPERF_ACT = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.IMPERFECT, Voice.ACTIVE);
export const SJV_IMPERF_PASS = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.IMPERFECT, Voice.PASSIVE);
export const SJV_PERF_ACT = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.PERFECT, Voice.ACTIVE);
export const SJV_PERF_PASS = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.PERFECT, Voice.PASSIVE);
export const SJV_PLUP_ACT = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.ACTIVE);
export const SJV_PLUP_PASS = FormBuilder.of(Mood.SUBJUNCTIVE, Tense.PAST_PERFECT, Voice.PASSIVE);

export const INF_PRES_ACT = FormBuilder.of(Mood.INFINITIVE, Tense.PRESENT, Voice.ACTIVE);
export const INF_PRES_PASS = FormBuilder.of(Mood.INFINITIVE, Tense.PRESENT, Voice.PASSIVE);
export const INF_PERF_ACT = FormBuilder.of(Mood.INFINITIVE, Tense.PERFECT, Voice.ACTIVE);
export const INF_PERF_PASS = FormBuilder.of(Mood.INFINITIVE, Tense.PERFECT, Voice.PASSIVE);
export const INF_FUT_ACT = FormBuilder.of(Mood.INFINITIVE, Tense.FUTURE, Voice.ACTIVE);
export const INF_FUT_PASS = FormBuilder.of(Mood.INFINITIVE, Tense.FUTURE, Voice.PASSIVE);

export const PTCP_PRES_ACT = FormBuilder.of(Mood.PARTICIPLE, Tense.PRESENT, Voice.ACTIVE);
export const PTCP_PERF_PASS = FormBuilder.of(Mood.PARTICIPLE, Tense.PERFECT, Voice.PASSIVE);
export const PTCP_FUT_ACT = FormBuilder.of(Mood.PARTICIPLE, Tense.FUTURE, Voice.ACTIVE);
export const PTCP_FUT_PASS = FormBuilder.of(Mood.PARTICIPLE, Tense.FUTURE, Voice.PASSIVE);

export const IMP_PRES_ACT = FormBuilder.of(Mood.IMPERATIVE, Tense.PRESENT, Voice.ACTIVE);
export const IMP_PRES_PASS = FormBuilder.of(Mood.IMPERATIVE, Tense.PRESENT, Voice.PASSIVE);
export const IMP_FUT_ACT = FormBuilder.of(Mood.IMPERATIVE, Tense.FUTURE, Voice.ACTIVE);
export const IMP_FUT_PASS = FormBuilder.of(Mood.IMPERATIVE, Tense.FUTURE, Voice.PASSIVE);
