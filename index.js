import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import readline from "readline";
import Translator from "./src/translator.js";
import { compileWord } from './src/debugHelpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawText = fs.readFileSync(path.join(__dirname, "/bin", "/dest", "dictionary.txt"), 'utf8')

let translator;

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a word or sentence, or "help" for more options: '
});

cli.prompt();

cli.on('line', line => {
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
      const param = line.replace("compile ", "");
      compileWord(param, rawText);
      cli.prompt();
      break;
    case '':
      cli.prompt();
      break;
    default:
      if (!translator) {
        console.log("Building dictionary...");
        translator = new Translator(rawText);
      }
      translator.translate(line);
      cli.prompt();
      break;
  }
}).on('close', () => {
  process.exit(0);
});
