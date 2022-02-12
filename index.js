import Main from "./src/main.js";
console.log("TRANSLATING")
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const words = process.argv.slice(2).join(" ");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawText = fs.readFileSync(path.join(__dirname, "/bin", "dictpage_converted.txt"), 'utf8')

Main.translate(words, rawText);


// TODO: Use for later CLI Interface
// import readline from "readline";
// 
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: 'Enter a sentence: '
// });

// rl.prompt();

// rl.on('line', (line) => {
//   switch (line.trim()) {
//       case 'exit':
//           rl.close();
//           break;
//       default:
//           sentence = line + '\n'
//           writableStream.write(sentence);
//           rl.prompt();
//           break;
//   }
// }).on('close', () => {
//   writableStream.end();
//   writableStream.on('finish', () => {
//       console.log(`All your sentences have been written to ${filePath}`);
//   })
//   setTimeout(() => {
//       process.exit(0);
//   }, 100);
// });
