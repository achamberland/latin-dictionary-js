// Manages global state for very large datasets of class instances

import { createSlice } from '@reduxjs/toolkit'

// TODO: THese are 'Word', not TranslationChunk... use that
const mockTranslations = {
  agnusDei: { english: "dfssdf", name: "agnus-dei"},
  gloryBe: { english: "Glory be to", name: "glory-be"},
  hailMary: { english: "", name: "hail-mary", chunks: [
    {"word":"Ave","form":{"person":"2.","plurality":"SG","mood":"IMP","tense":"PRES","voice":"ACT"},"definition":{"type":"V","description":"hail; fare/be well; (imp/inf; greeting/leaving); [ ~ jubeo => i send greetings]; be eager or anxious; desire, wish for, long after, crave;","translations":{},"forms":{},"codes":{"age":null,"frequency":6,"source":"old"}}},
    {"word":"Maria","form":{"gender":"N"},"definition":"Maria"},
    {"word":"gratia","form":{"plurality":"SG","casus":"NOM","gender":"F"},"definition":{"type":"N","description":"popularity/esteem/credit (w/bona); partiality/favoritism; unpopularity (w/mala); favor/goodwill/kindness/friendship; influence; gratitude; thanks (pl.); graces; |agreeableness, charm; grace; [doctor gratiae  => st. augustine of hippo];","translations":{},"forms":{},"genus":"F","codes":{"age":null,"frequency":7,"source":"old"}}},
    {"word":"plena","form":{"plurality":"SG","casus":"NOM","gender":"F"},"definition":{"type":"ADJ","description":"full, plump; satisfied;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"Dominus","form":{"plurality":"SG","casus":"NOM","gender":"M"},"definition":{"type":"N","description":"owner, lord, master; the lord; title for ecclesiastics/gentlemen;","translations":{},"forms":{},"genus":"M","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"tecum","form":{},"definition":{"type":"ADV","description":"with you;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"Benedicta","form":{"plurality":"SG","mood":"PTCP","tense":"PERF","voice":"PASS","casus":"NOM","gender":"F"},"definition":{"type":"V","description":"bless; praise; speak well of; speak kindly of (classically 2 words);","translations":{},"forms":{},"codes":{"age":"later","frequency":7,"source":null}}},
    {"word":"tu","form":{"plurality":"SG","casus":"NOM"},"definition":{"type":"PRON","description":"you, thee;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"in","form":{},"definition":{"type":"PREP","description":"in, on, at (space); in accordance with/regard to/the case of; within (time);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"mulieribus","form":{"plurality":"PL","casus":"DAT","gender":"F"},"definition":{"type":"N","description":"woman; wife; mistress;","translations":{},"forms":{},"genus":"F","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"et","form":{},"definition":{"type":"CONJ","description":"and, and even; also, even; (et ... et = both ... and);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"benedictus","form":{"plurality":"SG","mood":"PTCP","tense":"PERF","voice":"PASS","casus":"NOM","gender":"M"},"definition":{"type":"V","description":"bless; praise; speak well of; speak kindly of (classically 2 words);","translations":{},"forms":{},"codes":{"age":"later","frequency":7,"source":null}}},
    {"word":"fructus","form":{"plurality":"SG","casus":"NOM","gender":"M"},"definition":{"type":"N","description":"fruit;","translations":{},"forms":{},"genus":"M","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"ventris","form":{"plurality":"SG","casus":"GEN","gender":"M"},"definition":{"type":"N","description":"stomach, womb; belly;","translations":{},"forms":{},"genus":"M","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"tui","form":{"plurality":"SG","casus":"GEN"},"definition":{"type":"PRON","description":"you, thee;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"Iesus","form":{"gender":"N"},"definition":"Iesus"},
    {"word":"Sancta","form":{"plurality":"SG","casus":"NOM","gender":"F"},"definition":{"type":"ADJ","description":"consecrated, sacred, inviolable; venerable, august, divine, holy, pious, just;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"Maria","form":{"gender":"N"},"definition":"Maria"},
    {"word":"Mater","form":{"plurality":"SG","casus":"NOM","gender":"F"},"definition":{"type":"N","description":"mother, foster mother; lady, matron; origin, source, motherland, mother city;","translations":{},"forms":{},"genus":"F","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"Dei","form":{"plurality":"SG","casus":"GEN","gender":"N"},"definition":{"type":"N","description":"god;","translations":{},"forms":{},"genus":"N","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"ora","form":{"person":"2.","plurality":"SG","mood":"IMP","tense":"PRES","voice":"ACT"},"definition":{"type":"V","description":"beg, ask for, pray; beseech, plead, entreat; worship, adore;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"pro","form":{},"definition":{"type":"PREP","description":"on behalf of; before; in front/instead of; for; about; according to; as, like;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"nobis","form":{"plurality":"PL","casus":"DAT"},"definition":{"type":"PRON","description":"i, me;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"peccatoribus","form":{"plurality":"PL","casus":"DAT","gender":"M"},"definition":{"type":"N","description":"sinner; transgressor;","translations":{},"forms":{},"genus":"M","codes":{"age":"late","frequency":4,"source":"l+s"}}},
    {"word":"nunc","form":{},"definition":{"type":"ADV","description":"now, today, at present;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"et","form":{},"definition":{"type":"CONJ","description":"and, and even; also, even; (et ... et = both ... and);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"in","form":{},"definition":{"type":"PREP","description":"in, on, at (space); in accordance with/regard to/the case of; within (time);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"hora","form":{"plurality":"SG","casus":"NOM","gender":"F"},"definition":{"type":"N","description":"hour; time; season; [horae => seasons];","translations":{},"forms":{},"genus":"F","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"mortis","form":{"plurality":"SG","casus":"GEN","gender":"F"},"definition":{"type":"N","description":"death; corpse; annihilation;","translations":{},"forms":{},"genus":"F","codes":{"age":null,"frequency":7,"source":null}}},
    {"word":"nostrae","form":{"plurality":"SG","casus":"GEN","gender":"F"},"definition":{"type":"ADJ","description":"our;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}}
  ]},
  signOfTheCross: {
    english: "In in the Name of The Father, and of The Son, and of The Holy Spirit",
    name: "sign-of-the-cross",
    chunks: [
      {"word":"In","form":{},"definition":{"type":"PREP","description":"in, on, at (space); in accordance with/regard to/the case of; within (time);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"Nomine","form":{"plurality":"SG","casus":"ABL","gender":"N"},"definition":{"type":"N","description":"name, family name; noun; account, entry in debt ledger; sake; title, heading;","translations":{},"forms":{},"genus":"N","codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"Patris","form":{"plurality":"SG","casus":"GEN","gender":"M"},"definition":{"type":"N","description":"father; [pater familias, patris familias => head of family/household];","translations":{},"forms":{},"genus":"M","codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"et","form":{},"definition":{"type":"CONJ","description":"and, and even; also, even; (et ... et = both ... and);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"Filii","form":{"plurality":"SG","casus":"GEN","gender":"M"},"definition":{"type":"N","description":"son;","translations":{},"forms":{},"genus":"M","codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"et","form":{},"definition":{"type":"CONJ","description":"and, and even; also, even; (et ... et = both ... and);","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"Spiritu","form":{"plurality":"SG","casus":"ABL","gender":"M"},"definition":{"type":"N","description":"breath, breathing, air, soul, life;","translations":{},"forms":{},"genus":"M","codes":{"age":null,"frequency":7,"source":null}}},
      {"word":"Sancti","form":{"plurality":"SG","casus":"GEN","gender":"M"},"definition":{"type":"ADJ","description":"consecrated, sacred, inviolable; venerable, august, divine, holy, pious, just;","translations":{},"forms":{},"codes":{"age":null,"frequency":7,"source":null}}}
    ]
  }
};


const initialState = {
  chunks: null,
  dictionary: null,
  forms: null,
  translations: mockTranslations, // Temporary | null,
  words: null,
};

const validHugeKeys = Object.keys(initialState);

export const hugeDataSlice = createSlice({
  name: 'hugeData',
  initialState,
  reducers: {
    add: (state, action) => {
      for (let [key, huge] of Object.entries(action.payload)) {
        if (!huge) {
          throw new Error(
            `hugeDataReducer: Must have data for key "${key}".` + 
            `Use clear() if this wasn't an accident.`
          );
        }
        if (validHugeKeys.includes(key)) {
          state[key] = huge;
        } else {
          throw new Error(`hugeDataReducer: Attempted to add invalid key: "${key}".`);
        }

        // If manual garbage collection is needed
        // delete action.payload[key];
      }
    },

    // I don't know why this would ever be used
    clear: (state, action) => {
      const { keys = validHugeKeys } = action.payload;
      for (let key of keys) {
        if (!validHugeKeys.includes(key)) {
          throw new Error(`hugeDataReducer: Attempted to add invalid key: "${key}".`);
        }
        state[key] = initialState[key];
      }
    }
  },
})

export const { add, clear } = hugeDataSlice.actions

export default hugeDataSlice.reducer
