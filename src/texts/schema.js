
// Todo: Use { type: "", data: {} } as root structure?

const schema = {
  // In order of original Latin
  chunks: [
    // Nouns
    {
      latin: "nomine",        // Automatically added, unnecessary to define
      english: "name",        // Unnecessary here, automatic translation will also be "name"
      type: "default",        // Unnecessary here
      article: 2,             // Required here
      hasLatinCase: true,     // Required here: if true, case preposition is already in Latin text ("in" in this case)
      casePreposition: "",    // Unnecessary because hasLatinPreposition is true

      // Manual overrides, corresponding to enums
      case: "nom",
      plurality: "singular",
      // etc.

      notes: "",              // Unnecessary; Displays special note to user if translation is irregular
    }, {
      english: "Father",      // Unnecessary here, would default to "Father" in this case
      article: 2,             // Unnecessary here, "the" is default when noun is capitalized (TODO: This)
      casePreposition: "of",  // Unnecessary here, "of" is already the default,
      latin: "Patris",
    },
    // ...

    // Transliteral english
    {
      wordType: "noun",       // Unnecessary here
      translationType:
        "transliteral",       // Necessary
      latin:
        "saecula saeculorum", // Required
      english:
        "world without end",  // Transliterated english phrase or word
      article: 0,             // Unnecessary here
      notes: "",
      literals: [
        // Same format as non-transliteral
        {
          latin: "saecula",
          english: "ages",
          case: "nom",
          plurality: "plu",
        },
        {
          latin: "saeculorum",
          english: "ages",
        }
      ],
    },
    // Verb (TODO: Work this out)
    {
      wordType: "verb",       // Automatically defined unless override needed
      latin: "introibo",
      english: "go",          // Unnecessary here, unless alternate english tense like "be going" is used
      excludePronoun:
        true,                 // Unnecessary here, (ex. "will go" in this case if false)
      excludePreposition:
        true,                 // Unnecessary here, (ex. "I go" in this case if false, w/"go" treated future tense) 
      notes: "",
    },
    // Subjunctive
    {
      wordType: "verb",       // Automatically defined unless override needed
      latin: "sit",
      english: "let him be",  // Unnecessary here, unless alternate english tense like "be going" is used
      excludePronoun: false,  // Unnecessary here, (ex. "let be" if false)
      excludePreposition:
        true,                 // Unnecessary here, (ex. )
      voice: undefined,       // Unnecessary here (ex. "him be" if "" or null)
      notes: "",
    }
  ]
}


// CHUNKS AS OBJECT
//
// const schema = {
//   chunks: {
//     // Nouns
//     nomine: {
//       english: "name",        // Unnecessary here, automatic translation will also be "name"
//       article: 2,             // Required here
//       hasLatinCase: true,     // Required here: if true, case preposition is already in Latin text ("in" in this case)
//       casePreposition: "",    // Unnecessary because hasLatinPreposition is true
//       latin: "nomine",        // Automatically added, unnecessary to define
//     },
//     Patris: {
//       english: "Father",      // Unnecessary here, would default to "Father" in this case
//       article: 2,             // Unneessary here, "the" is default when noun is capitalized (TODO: This)
//       casePreposition: "of",  // Unnecessary here, "of" is already the default,
//       latin: "Patris",
//     },
//     // Transliteral english
//     "saecula saeculorum": {
//       transliteral: {
//         english:
//           "world without end", // Transliterated english phrase or word
//         article: 0,           // Default
//         latin: "saecula saeculorum",
//         chunks: {
//           saecula: {
//             english: "ages",
//             case: "nom",
//             plurality: "plu",
//             latin: "saecula"
//           },
//           saeculorum: {
//             english: "ages",
//             latin: "saeculorum",
//           }
//         },
//       },
//       literal: {
//         saecula: {
          
//         },
//         saeculorum: {

//         }
//       }
//     }
//     // Verb
//   }
// }
