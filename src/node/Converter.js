// package org.kobjects.nlp.latin.whitaker;

// import java.io.BufferedReader;
// import java.io.File;
// import java.io.FileOutputStream;
// import java.io.InputStreamReader;
// import java.io.OutputStreamWriter;
// import java.io.Writer;

// import org.kobjects.nlp.api.Strings;

/**
 * Tool to convert the plain text dictionary output from whitaker's words to a simplified
 * format.
 */

// See http://archives.nd.edu/whitaker/wordsdoc.htm#Dictionary%20Codes
resolveCodes(codes) {
  let output = "";
  output += this.resolveAge(codes.charAt(0));
  output += this.resolveCategory(codes.charAt(1));
  output += this.resolveRegion(codes.charAt(2));
  output += this.resolveFrequency(codes.charAt(3));
  output += this.resolveSource(codes.charAt(4));
  
  if (output.length > 0) {
    return output.substring(0, output.length - 2);
  }
  return output;   
}

resolveAge(code) {
  switch (code) {
    case 'A': return "age=archaic, ";
    case 'B': return "age=early, ";
    case 'C': return "age=classical, ";
    case 'D': return "age=late, ";
    case 'E': return "age=later, ";
    case 'F': return "age=medieval, ";
    case 'G': return "age=scholar, ";
    case 'H': return "age=modern, ";
  }
}

resolveCategory(code) {
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
  }
}

resolveRegion(code) {
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
  }
}

resolveFrequency(code) {
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
  }
}

resolveSource(code) {
  switch (code) {
    case 'B': return "src=Bee, ";
    case 'C': return "src=CAS, ";
    case 'D': return "src=Sex, ";
    case 'E': return "src=Ecc, ";
    case 'F': return "sec=Def, ";
    case 'G': return "src=G+L, ";
    case 'H': return "src=Ouvrard, ";
    case 'I': return "src=Leverett1845, ";
    case 'K': return "src=Cal, ";
    case 'L': return "src=Levis1891, ";
    case 'M': return "src=Latham1980, ";
    case 'N': return "src=Nelson, ";
    case 'O': return "src=OLD, ";
    case 'P': return "src=Souter1949, ";
    case 'Q': return "src=other, ";
    case 'S': return "src=L+S, ";
    case 'T': return "src=translation, ";
    case 'U': return "src=DuCange, ";
    case 'V': return "src=Saxo, ";
    case 'W': return "src=guess, ";
    case 'Z': return "src=user, ";
  }
}

cleanKind(kind) {
  let kind = Strings.supertrim(kind);
  const cut0 = kind.indexOf('(');
  const cut1 = kind.indexOf(')', cut0 + 1);
  if (cut0 !== -1 && cut1 > cut0 + 1) {
    const d = kind.charAt(cut0+1);
    if (d >= '0' && d <= '9') {
      kind = kind.substring(0,  cut0) + d + kind.substring(cut1 + 1);
    }
  }
  return kind;
}
  
// TODO: Finish - very low priority since text is already generated
export default function(...args) {
  const streamChunks = [];
  const file = fs.open("dictpage.txt");
  const stream = file.createReadStream({ encoding: "iso-8859-1" })
  
  stream.on("data", chunk => streamChunks.push(chunk));
  stream.on("close", () => Buffer.concat(streamChunks));

  BufferedReader reader = new BufferedReader(new InputStreamReader(Converter.class.getResourceAsStream("dictpage.txt"), "iso-8859-1"));
  
  Writer out = new OutputStreamWriter(new FileOutputStream(new File("src/org/kobjects/nlp/latin/whitaker_converted.txt")), "utf-8");
  String nextLine = reader.readLine();
  do {
    String line = nextLine;
    nextLine = reader.readLine();
    
    while (nextLine != null && nextLine.indexOf('|') !== -1) {
      int cut = nextLine.lastIndexOf('|');
      line += " " + nextLine.substring(cut + 1);
      nextLine = reader.readLine();
    }
    
    if (!line.startsWith("#")) {
      continue;
    }
    
    int cut0 = line.indexOf("  ");
    int cut1 = line.indexOf("[", cut0);
    int cut2 = line.indexOf(" :: ");
          
    String latin = Strings.supertrim(line.substring(1, cut0));
    String kind = Strings.supertrim(line.substring(cut0 + 2, cut1));
    String codes = Strings.supertrim(line.substring(cut1 + 1, cut1 + 7));
    String english = Strings.supertrim(line.substring(cut2 + 4));
    
    if (kind.startsWith("V ") && (kind.indexOf("ACTIVE") !== -1 || kind.indexOf("PASSIVE") !== -1) 
        || kind.startsWith("N")  && kind.length > 3 
        || kind.startsWith("ADJ") && kind.length > 3) {
        continue;
    }

    kind = cleanKind(kind);
    codes = resolveCodes(codes);

    out.write(latin);
    out.write("; ");
    out.write(cleanKind(kind));
    if (codes != null && !codes.isEmpty()) {
      out.write("; ");
      out.write(codes);
    }
    out.write(":\n");

    String[] parts = english.split(";");
    for (let i = 0; i < parts.length; i++) {
      out.write("  ");
      out.write(parts[i].trim());
      out.write(i < parts.length - 1 ? ";\n" : "\n");
    }
  } while (nextLine != null);

  out.close();
}
	