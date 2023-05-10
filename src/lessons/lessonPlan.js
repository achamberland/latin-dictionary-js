import Case from "../dictionary/constants/Case";
import Mood from "../dictionary/constants/Mood";
import Plurality from "../dictionary/constants/Plurality";
import Tense from "../dictionary/constants/Tense";
import Voice from "../dictionary/constants/Voice";


/*
 * Sequential map of what to cover in each "lesson".
 * A lesson is the same as one quiz, of 10 questions
 *
 * When the user gets x/10 correct, the user can move on to the next lesson.
 * 
 * This is a full plan for all lessons, based on
 * the public domain book "Latin by the Natural Method, First year".
 */

const lessonPlan = [
  {
    key: "first",
    name: "First lesson",
    // Based on first subheading of the book's lesson.
    description: "Starting off with simple 3rd-person past-tense verbs" +
      "and singular nouns in the nominative and accusative case.",
    // A quick summary of the lesson from the book, used before questions
    lesson: "",
    // Permitted parts of a word form
    // Opposite if "allow" isn't passed (for later lessons) will be called "disallow"
    allow: {
      // Limit words by case
      cases: [Case.NOMINATIVE, Case.ACCUSATIVE],
      mood: [Mood.INDICATIVE],
      plurality: [Plurality.SINGULAR],
      tense: [Tense.PERFECT],
      voice: [Voice.ACTIVE]
    },
    // Things to emphasize for the current lesson
    // (The first lesson has none)
    // Todo: should these be Forms?
    highlight: {}
  }
];

// Todo: Later, also export object of lessons by name, w/ order as object attribute

export default lessonPlan;
