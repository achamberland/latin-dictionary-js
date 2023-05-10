import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import readline from "readline";
import DefinitionLogger from "./src/cli/DefinitionPrinter.js";
import { compileWord } from './src/cli/debugHelpers.js';
import parseTranslation from './src/translations/parseTranslation.js';
import compareTranslations from './src/cli/compareTranslations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawText = fs.readFileSync(path.join(__dirname, "/assets", "/dictionary", "dictionary.txt"), 'utf8')

let definer;

const ensureDictionary = () => {
  if (!definer) {
    console.log("Building dictionary...");
    console.log("(This only needs to be done once, but it will take a minute)");
    definer = new DefinitionLogger(rawText);
  }
}

// First param
const readFileByParam = line => {
  let param = line.match(/^\s?\w+ (\S+)/, "")?.[1];
  if (!param) {
    throw new Error(`Invalid file name param for command: ${line}`);
  }
  if (!param.endsWith(".json")) {
    param += ".json";
  }
  console.log(param);
  return fs.readFileSync(path.join(__dirname, "/assets", "/translations", param), 'utf8');
}

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter "help" for all commands: '
});

cli.prompt();

cli.on('line', line => {
  let param = null;
  let fileText = null;
  switch (line.trim().split(" ")?.[0]) {
    case 'exit':
      cli.close();
      break;
    case 'help':
      console.log(
        "\Commands:\n" +
        "chunks [file] - Build and print TranslationChunks for the passed json file.\n" +
        "compile [word] - Compile a single word as done when the dictionary is built.\n" +
        "compare [file] - Build comparisons for all chunks within the passed file.\n" +
        "definition [word] - Lookup dictionary definition for passed word or words." 
      );
      cli.prompt();
      break;
    case 'chunks':
      fileText = readFileByParam(line);
      ensureDictionary();
      try {
        parseTranslation(fileText, definer.latin);
      } catch(e) {
        console.error(e);
      }
      cli.prompt();
      break;
    case 'compile':
      param = line.replace("compile ", "");
      compileWord(param, rawText);
      cli.prompt();
      break;
    case 'compare':
      fileText = readFileByParam(line);
      ensureDictionary();
      try {
        compareTranslations(fileText, definer.latin);
      } catch(e) {
        console.error(e);
      }
      cli.prompt();
      break;
    case "definition":
      param = line.replace("definition ", "");
      ensureDictionary();
      try {
        definer.define(line);
      } catch(e) {
        console.error(e);
      }
      cli.prompt();
      break;
    default:
      cli.prompt();
      break;
  }
}).on('close', () => {
  process.exit(0);
});
