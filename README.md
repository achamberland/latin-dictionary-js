# Processing Whitaker's Words with JavaScript

From a raw text Latin dictionary, this parses each definition and its conjugations, declinations, etc. from it. With this, Latin words in any form can be searched and converted from one form to another.

This is a work-in-progress, and for now only searches for latin words passed on the npm start command, logging information for each to the console.

JavaScript classes are used only to port the original Java more quickly.

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

# Derived work
This is a JavaScript port of Stefan Haustein's original "nlp" Java project, found [here](https://github.com/stefanhaustein/nlp).

## Notes from his project

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