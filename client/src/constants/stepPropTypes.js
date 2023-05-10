import { arrayOf, instanceOf, number, oneOf, shape, string } from "prop-types";

const TYPES = ["multipleChoice"];
const COMMONALITIES = ["form", "word"];

/*
 * This assumes that answers will always be a Word or derived from it.
 *   Todo: Not a good assumption to make.
 *   Possibly try the polymorphic thing and pass an 'answerType'
 */

const reducerItemPropType = shape({
  type: oneOf(TYPES),
  commonalityType: oneOf(COMMONALITIES),
  translationName: string,
  chunk: number,
  // expected: ?, // What unique Word id can be made?
  // answered: ?, // What unique Word id can be made?
  // answerType: ? // See above TODO
});

export const reducerSchema = arrayOf(reducerItemPropType);

const stepPropType = {
  step: reducerItemPropType,
  // chunk: instanceOf(TranslationChunk),
  // translation: instanceof(Translation),
  // wordAnswered: instanceOf(Word),
  // wordExpected: instanceOf(Word),

  // TBD: answerType: ["Word"]
}

export default stepPropType;
