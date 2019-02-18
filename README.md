# Processing Whitaker's Words with Java

## Deviations from the original

 - The dictionary used is based on the generated human-readable word list found on 
   http://archives.nd.edu/whitaker/dictpage.htm. It has been processed further to reduce 
   redundancies and to improve human-readability while keeping the file easy to parse.  

   - The processed file is named whitaker_converted.txt and is contained in the package 
     org.kobjects.nlp.latin.  
   - The corresponding processing code and original input can be found in the package 
     org.kobjects.nlp.latin.whitaker.
 
 - Inflections are part of the code, see Delcinator.java and Conjugator.java in org.kobjects.nlp.latin
 
 - The program currently just generates all word forms in memory when loading the dictionary.
 
## Words Preservation 

For a maintained version William Whitaker's original WORDS programm, 
please refer to https://github.com/mk270/whitakers-words
 
