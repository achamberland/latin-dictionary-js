import fs from "fs";
import path from "path";
import split from "split";
import { Transform } from "stream";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yeah I know, streams are unnecessary here but this is copy/pasted for speed

// Naively converts Latin text to json template to be filled by developer

const fileName = process.argv[2];
if (!fileName) throw new Error("Source .txt file name must be passed");

const inputFilePath = path.join(__dirname, "./texts", fileName);
const outputFilePath = path.join(
  __dirname,
  "../../assets/translations/templates",
  fileName.replace(".txt", ".json.template")
);

if (fs.existsSync(outputFilePath)) {
  throw new Error(
    "Template file already exists! " +
    `Rename it to '${fileName.replace(".txt", ".json")}' and move it to ` +
    "assets/translations if you intend to use it"
  );
}

const readStream = fs.createReadStream(inputFilePath, "utf-8");
const writeStream = fs.createWriteStream(outputFilePath, "utf-8");


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
