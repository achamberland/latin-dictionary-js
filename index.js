import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import readline from "readline";
import Translator from "./src/translator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawText = fs.readFileSync(path.join(__dirname, "/bin", "/dest", "dictionary.txt"), 'utf8')

const translator = new Translator(rawText)

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a word or sentence: '
});

cli.prompt();

cli.on('line', line => {
  switch (line.trim()) {
    case 'exit':
      cli.close();
      break;
    default:
      translator.translate(line);
      cli.prompt();
      break;
  }
}).on('close', () => {
  process.exit(0);
});
