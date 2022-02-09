import Main from "./src/main.js";
import fs from 'fs';
import path from 'path';

const words = process.argv.slice(2).join(" ");

let rawText = fs.readFileSync(path.resolve(__dirname, './whitaker_converted.txt'), 'utf8')

Main.translate(words, rawText);
