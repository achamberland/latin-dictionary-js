
/**
 * Tool to convert the plain text dictionary output from whitaker's words to a simplified
 * format.
 * 
 * This is more of a holdover from the original Java project,
 *   I don't see why we can't just use WW directly.
 * 
 * CHANGES FROM ORIGINAL:
 * Additional definitions starting with "|" which WW calls "continuation MEAN" defs are now included
 *
 * TODO:
 * - Process definitions marked with "[suffix => def]" if they aren't
 */
  
 import fs from "fs";
 import path from "path";
 import split from "split";
 import { Transform } from "stream";
 import CombinedStream from 'combined-stream';
 import { fileURLToPath } from "url";
 
 import { supertrim } from "../../src/utils/stringUtils.js";
 
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
 const inputDirPath = path.join(__dirname, "./");
 const outputFilePath = path.join(__dirname, "../../assets/dictionary", "dictionary.txt");
 
 const readStream = CombinedStream.create();
 const readMainStream = fs.createReadStream(path.join(inputDirPath, "dictpage.txt"), "latin1");
 let readExtensionsStream = fs.createReadStream(path.join(inputDirPath, "extensions.lat"), "utf8");
 
 readStream.maxDataSize = 1024 * 1024 * 8; // 8 Megabytes
 
 // Set write stream event handlers ahead of time
 const writeStream = fs.createWriteStream(outputFilePath, "utf-8");
 writeStream
   .on('close', () => {
     console.log('conversion finished.')
     process.exit();
   });
 readStream
   .on("error", (err) => { throw new Error(err) })
   .on('finish', () => {
     console.log(`Finished processing dictionary files in '${inputDirPath}'.\n Saved output to '${outputFilePath}'.`);
     readStream.destroy();
   })
   .on('close', () => writeStream.end());
 
 
let removalsArray = null;
function readRemovalsArray() {
  const removeFileContents = fs.readFileSync(path.join(inputDirPath, "remove.lat"), "latin1");
  return removeFileContents.substring(1).split("\n#");
}

const filterTransformStream = new Transform({
  transform(data, encoding, callback) {
    const line = data.toString();
    if (isLineExcluded(line)) {
      console.log("EXCLUDED", line);
      callback();
    } else {
      this.push(filterAndCutLine(data.toString()));
      callback();
    }
  },

  // Add extensions, none of which should be filtered
  flush(callback) {
    this.push(readExtensionsBuffer);
    console.log("Flushed")
    callback();
  }
})
const processTransformStream = new Transform({
  transform (data, encoding, callback) {
    console.log(data.toString())
    this.push(processLine(data.toString()));
    callback();
  }
});
 
// Prep other Streams
readStream.append(readMainStream);

// Todo: This is technically out of timing (needs to be ready on filterTransformStream's flush event),
// but it will finish before needed
const readExtensionsBufferChunks = [];
let readExtensionsBuffer = null;
readExtensionsStream.pipe(split())
  .on("data", chunk => readExtensionsBufferChunks.push(Buffer.from(chunk, "utf-8")))
  .on('end', () => {
    readExtensionsBuffer = Buffer.concat(readExtensionsBufferChunks)
  });

// Main Stream Process
readMainStream
  .on("error", (err) => { throw new Error(err) })
  .pipe(split())
  .pipe(filterTransformStream)
  .pipe(split(/(?:\:\:)|[\n;]/))
  .pipe(processTransformStream)
  .pipe(writeStream)
  .on("close", () => console.log("CLOSED"));

// Step 2: Convert and write to file
function convertAndWrite() {
  readStream
    .pipe(split())
    .pipe(filterTransformStream)
    .pipe(split(/(?:\:\:)|[\n;]/))
    .pipe(processTransformStream)
    .pipe(writeStream)
}

function isLineExcluded(line) {
  if (!removalsArray) {
    removalsArray = readRemovalsArray();
  }
  const words = line.substring(1, line.indexOf("  ")).split(", ")
  return words.some(word => (
    removalsArray.includes(word)
  ));
}
 
 function filterAndCutLine(line) {
   const pipeIndex = line.indexOf("|");
   
   // Case 1: Merge with prev line
   if (pipeIndex > -1) {
     return ` ${line.substring(pipeIndex + 1)}`;
   }
   
   // Case 2: skip line
   let cut0 = line.indexOf("  ");
   let cut1 = line.indexOf("[", cut0);        
   let kind = supertrim(line.substring(cut0 + 2, cut1));
   
   // Irregular words requiring extra kind data for case
   // Commented but left in in case something breaks by allowing these, unlike Java repo
   // Todo: Set extra data and pull that in Declinator/Conjugator
   //
   // if (
   //   kind.startsWith("V ") && (kind.indexOf("ACTIVE") !== -1 || kind.indexOf("PASSIVE") !== -1) ||
   //   (kind.startsWith("N")  && kind.length > 3) ||
   //   (kind.startsWith("ADJ") && kind.length > 3)
   // ) {
   //   return "";
   // }
   // Abbreviations
   if (kind.startsWith("abb.")) {
     return "";
   }
 
   // Case 3: Normal
   return line;
 }
 
 function processLine(line) {
   // Incorrect Regex 
   if (!line.trim()) {
     return "";
   // Dictionary definitions
   } else if (!line.startsWith("#")) {
     return ` ${line};\n`;
   }
   
   let cut0 = line.indexOf("  ");
   let cut1 = line.indexOf("[", cut0);
         
   const latin = supertrim(line.substring(1, cut0));
   let kind = supertrim(line.substring(cut0 + 2, cut1));
   let codes = supertrim(line.substring(cut1 + 1, cut1 + 7));
   // const english = supertrim(line.substring(cut2 + 4));
 
   kind = cleanKind(kind);
   codes = resolveCodes(codes);
 
   const codesPart = codes?.length ? `; ${codes}` : "";
 
   // This skips the semicolon for the last english definition - problem?
   //
   // String[] parts = english.split(";");
   // for (let i = 0; i < parts.length; i++) {
   //   out.write("  ");
   //   out.write(parts[i].trim());
   //   out.write(i < parts.length - 1 ? ";\n" : "\n");
   // }
 
   return `${latin}; ${cleanKind(kind)}${codesPart}:\n`;
 }
 
 
 // See http://archives.nd.edu/whitaker/wordsdoc.htm#Dictionary%20Codes
 function resolveCodes(codes) {
   let output = "";
   output += resolveAge(codes.charAt(0));
   output += resolveCategory(codes.charAt(1));
   output += resolveRegion(codes.charAt(2));
   output += resolveFrequency(codes.charAt(3));
   output += resolveSource(codes.charAt(4));
   
   if (output.length > 0) {
     return output.substring(0, output.length - 2);
   }
   return output;   
 }
 
 function resolveAge(code) {
   switch (code) {
     case 'A': return "age=archaic, ";
     case 'B': return "age=early, ";
     case 'C': return "age=classical, ";
     case 'D': return "age=late, ";
     case 'E': return "age=later, ";
     case 'F': return "age=medieval, ";
     case 'G': return "age=scholar, ";
     case 'H': return "age=modern, ";
     case 'X': return "";
     default: throw new Error("Unrecognized Age: " + code);
   }
 }
 
 function resolveCategory(code) {
   switch(code) {
     case 'A': return "cat=agr, ";
     case 'B': return "cat=bio, ";
     case 'D': return "cat=drm, ";
     case 'E': return "cat=ecc, ";
     case 'G': return "cat=grm, ";
     case 'L': return "cat=leg, ";
     case 'P': return "cat=poe, ";
     case 'S': return "cat=sci, ";
     case 'T': return "cat=tec, ";
     case 'W': return "cat=war, ";
     case 'Y': return "cat=myt, ";
     case 'X': return "";
     default: throw new Error("Unrecognized Category: " + code);
   }
 }
 
 function resolveRegion(code) {
   switch (code) {
     case 'A': return "reg=Aftrica, ";
     case 'B': return "reg=Britain, ";
     case 'C': return "reg=China, ";
     case 'D': return "reg=Scandinavia, ";
     case 'E': return "reg=Egypt, ";
     case 'F': return "reg=France/Gaul, ";
     case 'G': return "reg=Germany, ";
     case 'H': return "reg=Greece, ";
     case 'I': return "reg=Italy/Rome, ";
     case 'J': return "reg=India, ";
     case 'K': return "reg=Balkans, ";
     case 'N': return "reg=Netherlands, ";
     case 'P': return "reg=Persia, ";
     case 'Q': return "reg=NearEast, ";
     case 'R': return "reg=Russia, ";
     case 'S': return "reg=Spain/Iberia, ";
     case 'U': return "reg=Eastern Europe, ";
     case 'X': return "";
     default: throw new Error("Unrecognized Region: " + code);
   }
 }
 
 function resolveFrequency(code) {
   switch (code) {
     case 'A': return "frq=+++, ";
     case 'B': return "frq=++, ";
     case 'C': return "frq=+, ";
     case 'D': return "frq=-, ";
     case 'E': return "frq=--, ";
     case 'F': return "frq=---, ";
     case 'I': return "frq=inscription, ";
     case 'M': return "frq=grafffiti, ";
     case 'N': return "frq=Pliny, ";
     case 'X': return "";
     default: throw new Error("Unrecognized Frequency: " + code);
   }
 }
 
 function resolveSource(code) {
   switch (code) {
     case 'A':
     case 'B': return "src=Bee, ";
     case 'C': return "src=CAS, ";
     case 'D': return "src=Sex, ";
     case 'E': return "src=Ecc, ";
     case 'F': return "sec=Def, ";
     case 'G': return "src=G+L, ";
     case 'H': return "src=Ouvrard, ";
     case 'I': return "src=Leverett1845, ";
     case 'J':
     case 'K': return "src=Cal, ";
     case 'L': return "src=Levis1891, ";
     case 'M': return "src=Latham1980, ";
     case 'N': return "src=Nelson, ";
     case 'O': return "src=OLD, ";
     case 'P': return "src=Souter1949, ";
     case 'Q': return "src=other, ";
     case 'R': return "src=PlaterWhite"
     case 'S': return "src=L+S, ";
     case 'T': return "src=translation, ";
     case 'U': return "src=DuCange, ";
     case 'V': return "src=Saxo, ";
     case 'W': return "src=guess, ";
     case 'Z': return "src=user, ";
     case 'Y':
     case 'X': return "";
     default: throw new Error("Unrecognized Source: " + code);
   }
 }
 
 function cleanKind(_kind) {
   let kind = supertrim(_kind);
   const cut0 = kind.indexOf('(');
   const cut1 = kind.indexOf(')', cut0 + 1);
   if (cut0 !== -1 && cut1 > cut0 + 1) {
     const d = kind.charAt(cut0 + 1);
     if (d >= 0 && d <= 9) {
       kind = kind.substring(0,  cut0) + d + kind.substring(cut1 + 1);
     }
   }
   return kind;
 }
 
 process.on('exit', () => console.log("EXITED"))
 setInterval(() => {}, 1 << 30);
