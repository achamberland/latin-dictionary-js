# Oremus
Learn Latin from the prayers you already know.

# Theory
In learning languages, Ecclesiastical Latin is very unique in that many know what a full sentence in Latin means in English, but not the individual words.

### Examples
- The Agnus Dei might be said in English or chanted in Latin, enough for both to be known by heart.
- Some may pray have memorized the prayers of the Rosary in Latin, but only with a very basic understanding of the actual words said.

By using phrases and sentences already memorized, the learner:
1) Starts already knowing the context and meaning as a whole, allowing them to focus on the mechanics and syntax of Latin rather than rote memorization.
2) Can pray in an easier and more authentic way, like speaking rather than reciting. (The name of this project - Oremus - means both "Let us speak" and "Let us pray").

By isolating two nearly-identical words which the user already knows, and asking them to find the difference between them, they can learn through this contrast.

# Steps of the game
1) Ask users familiarity level with the prayers provided, from the most basic individual prayers, to parts of the Latin Mass as a whole, to commonly sung psalms and hymns. 
2) Compare these prayers and calculate the most common words and inflections, weighted by familiarity levels of each plus some randomness.
3) Start the game, asking multiple choice questions relating to the things that are shared by the common wordsor to type in the right word

### Example
Given that "filio, filius" is common, ask how to say "of The Son", with possible answers being different forms of that base word, genitive being the correct choice. Provide hints when words are hovered. In a later question (maybe break up questions into two phases), ask for another word with the same genitive and root declension

# Technical parts of the project

### Dictionary pre-processing
`./bin/dictionary`
The dictionary for Whitaker's Words (the top open-source Latin translation program) is pre-processed for easier use by the app. Overrides for these can be set in bin/dictionary by:
- remove.lat: Words to remove from the dictionary. Normally for unimportant words that get higher priority than more common words used for this app's purposes
- extensions.lat: Custom definitions added for this project, in the same format as the WW dictionary file.

### Latin dictionary search
`src/dictionary/**`
From a raw text Latin dictionary, this parses each definition and its conjugations, declinations, etc. from it. With this, Latin words in any form can be searched and converted from one form to another.

The entire dictionary has to be built before it can be used.

This is heavily based on [a Java project called "nlp"](https://github.com/stefanhaustein/nlp), by Stefan Haustein. Due to this being a port of code originally in Java, this will be mostly class-based JavaScript until refactored.

### Translation pre-processing and helpers
For filling in translations faster, `./bin/translations/createTemplate.js` takes raw text file in `./bin/translations/texts` and creates a json template to be filled in manually.

### Translation Maps
Translations can be handled partially automatically, but because the Latin to English source is a set of definitions rather than word-by-word translations, these often need to be filled in manually in the JSON (located in `./assets/translations`). Any issues in automatic translation such as ambiguous declensions, wrong words, etc., are fixed manually.

These JSON files are then parsed into Translation instances with a TranslationChunk for each Latin word.

### Comparisons (In progress)
The similarity of words, selected by Translation can then be compared in many ways such as which words are most commonly used between Translations, or which words would be good opportunities for differentiating between nearly-identical forms.

Translations used will be weighted based on the user's familiarity with each, along with randomness and how often the user has seen these translations.

### Game (TODO)
The user can then guess which words or forms are correct for the prayers they already know. Details of this TBD, but it will involve a frontend and not just the command line

### App (TODO)
Separate Repo for now, to be combined with this later.

# Getting Started

## Running with node 
```
nvm use
npm i
```
Example run:
```
npm start sum amabo
```

# Derived work notes

### Deviations from the original

 - The dictionary used is based on the generated human-readable word list found on 
   http://archives.nd.edu/whitaker/dictpage.htm. It has been processed further to reduce 
   redundancies and to improve human-readability while keeping the file easy to parse.  

   - The processed file is named [whitaker_converted.txt](https://raw.githubusercontent.com/stefanhaustein/nlp/master/src/org/kobjects/nlp/latin/whitaker_converted.txt) and is contained in the package 
     [org.kobjects.nlp.latin](https://github.com/stefanhaustein/nlp/tree/master/src/org/kobjects/nlp/latin).  
   - The corresponding processing code and original input can be found in the package 
     org.kobjects.nlp.latin.whitaker.
 
 - Inflections are part of the code, see [Delcinator.java](https://github.com/stefanhaustein/nlp/blob/master/src/org/kobjects/nlp/latin/Declinator.java) and Conjugator.java in org.kobjects.nlp.latin
 
 - The program currently just generates all word forms in memory when loading the dictionary.
 
### Words Preservation 
The raw text dictionary is taken from William Whitaker's original WORDS project.

For a maintained version of the full program, please refer to https://github.com/mk270/whitakers-words.
