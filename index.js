import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import readline from "readline";
import Translator from "./src/translator.js";
import { compileWord } from './src/debugHelpers.js';
import parseTranslation from './src/texts/parseTranslation.js';
import compareTranslations from './src/texts/comparison/compareTranslations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawText = fs.readFileSync(path.join(__dirname, "/bin", "/dest", "dictionary.txt"), 'utf8')

let translator;

const ensureTranslator = () => {
  if (!translator) {
    console.log("Building dictionary...");
    translator = new Translator(rawText);
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
  return fs.readFileSync(path.join(__dirname, "/bin", "/dest/texts", param), 'utf8');
}

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a word or sentence, or "help" for more options: '
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
        "\nAdditional commands:\n" +
        "compile [word] - Compile a single word as done when the dictionary is built.\n"
      );
      cli.prompt();
      break;
    case 'compile':
      param = line.replace("compile ", "");
      compileWord(param, rawText);
      cli.prompt();
      break;
    case 'chunks':
      fileText = readFileByParam(line);
      ensureTranslator();
      try {
        parseTranslation(fileText, translator.latin);
      } catch(e) {
        console.error(e);
      }
      cli.prompt();
      break;
    case 'compare':
      fileText = readFileByParam(line);
      ensureTranslator();
      try {
        compareTranslations(fileText, translator.latin);
      } catch(e) {
        console.error(e);
      }
      cli.prompt();
      break;
    case '':
      cli.prompt();
      break;
    default:
      ensureTranslator();
      try {
        translator.translate(line);
      } catch(e) {
        console.error(e);
      }
      cli.prompt();
      break;
  }
}).on('close', () => {
  process.exit(0);
});
