import Main from "./src/main.js";
console.log("TRANSLATING")
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const words = process.argv.slice(2).join(" ");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawText = fs.readFileSync(path.join(__dirname, "/src", "whitaker_converted.txt"), 'utf8')

Main.translate(words, rawText);
