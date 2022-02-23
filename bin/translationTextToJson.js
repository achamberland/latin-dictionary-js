import fs from "fs";
import path from "path";
import split from "split";
import { Transform } from "stream";
import { fileURLToPath } from "url";
// import WordType from "../src/api/WordType";
// import Latin from "../src/latin/Latin";
// import Translator from "../src/translator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yeah I know, streams are unnecessary here but this is copy/pasted for speed

// Naively converts Latin text to Translation-compatible json

const fileName = process.argv[2];
if (!fileName) throw new Error("bad path")

const inputFilePath = path.join(__dirname, "src/texts", fileName);
const outputFilePath = path.join(__dirname, "dest", fileName.replace(".txt", "_template.json"));

const readStream = fs.createReadStream(inputFilePath, "utf-8");
const writeStream = fs.createWriteStream(outputFilePath, "utf-8");

console.log("building dictionary...");
// const latinDictionary = new Latin(rawText);

let isFirstTranslation = true;
const processStream = new Transform({
  transform (data, encoding, callback) {
    const string = data.toString().trim().replaceAll("\n", " ");
    let out = "";
    if (!isFirstTranslation) {
      out = ",\n\t{";
    } else {
      isFirstTranslation = false;
    }
    console.log(string)
    out += `\n\t\t"text": "${string}",`;
    out += `\n\t\t"chunks": [\n`;
    string.split(" ").forEach((word, index) => {
      if (index !== 0) {
        out += `,\n`;
      }
      out += `\t\t\t{\n\t\t\t\t`;
      out += `"latin": "${word}"\n\t\t\t}`;
    });
    out += `\n\t\t]\n\t}`;
    this.push(out);
    callback();
  }
});

writeStream.write(`{\n\t"translations": [{`);

const processedStream = readStream
  .on("error", (err) => { throw new Error(err) })
  .pipe(split("#"))
  .pipe(processStream);


processedStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log(`Finished converting text to json in '${inputFilePath}'.\n Saved output to '${outputFilePath}'.`);
  readStream.destroy();
})
.on('close', () => writeStream.end());

writeStream.on('close', () => {
  console.log('conversion finished.\n\n_____\nDO NOT forget to rename the file when finished filling in data!\n')
  process.exit();
});


// const getWordType = (dictionary, wordText) => {
//   const found = dictionary.find(wordText);
//   if (!found) {
//     console.error("Couldn't find word, defaulting to Noun: " + word);
//     return WordType.NOUN;
//   }
//   return found.wordType;
// }

// function jsonForWordType(dictionary, wordText) {
//   switch(getWordType(dictionary, wordText)) {
//     case WordType.NOUN:
//       return nounJson(wordText);
//     case WordType.VERB:
//       return verbJson(wordText);
//     case WordType.ADJECTIVE:
//       return verbJson(wordText);
//     case WordType.ADVERB:
//       return verbJson(wordText);
//     default:
//       return baseJson(wordText);
//   }
// }

// const nounJson = () => baseJson + `,
//       "english": "name",
//       "translationType": "default",
//       "article": 1,
//       "hasLatinCase": true,
//       "casePreposition": "",
//       "notes": ""
// `;
