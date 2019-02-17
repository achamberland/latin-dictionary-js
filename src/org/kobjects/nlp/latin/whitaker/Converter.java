package org.kobjects.nlp.latin.whitaker;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;

/**
 * Tool to convert the plain text dictionary output from whitaker's words to a simplified
 * format.
 */
public class Converter {

	public static String resolveCodes(String codes) {
		StringBuilder sb = new StringBuilder();
		switch (codes.charAt(0)) {
			case 'A': sb.append("a:archaic, "); break;
			case 'B': sb.append("a:early, "); break;
			case 'C': sb.append("a:classical, "); break;
			case 'D': sb.append("a:late, "); break;
			case 'E': sb.append("a:later, "); break;
			case 'F': sb.append("a:medieval, "); break;
			case 'G': sb.append("a:scholar, "); break;
			case 'H': sb.append("a:modern, "); break;
		}
		switch (codes.charAt(1)) {
			case 'A': sb.append("c:agric.+, "); break;
			case 'B': sb.append("c:biomed.+, "); break;
			case 'D': sb.append("c:drama+, "); break;
			case 'E': sb.append("c:eccl.+, "); break;
			case 'G': sb.append("c:grammar+, "); break;
			case 'L': sb.append("c:legal+, "); break;
			case 'P': sb.append("c:poetic, "); break;
			case 'S': sb.append("c:sci.+, "); break;
			case 'T': sb.append("c:tech.+, "); break;
			case 'W': sb.append("c:war+, "); break;
			case 'Y': sb.append("c:mythology, "); break;
		}
		switch (codes.charAt(2)) {
		case 'A': sb.append("r:Aftrica, "); break;
		case 'B': sb.append("r:Britain, ");break;
		case 'C': sb.append("r:China, ");break;
		case 'D': sb.append("r:Scandinavia, ");break;
		case 'E': sb.append("r:Egypt, ");break;
		case 'F': sb.append("r:France/Gaul, ");break;
		case 'G': sb.append("r:Germany, ");break;
		case 'H': sb.append("r:Greece, ");break;
		case 'I': sb.append("r:Italy/Rome, ");break;
		case 'J': sb.append("r:India, ");break;
		case 'K': sb.append("r:Balkans, ");break;
		case 'N': sb.append("r:Netherlands, ");break;
		case 'P': sb.append("r:Persia, ");break;
		case 'Q': sb.append("r:Near East, ");break;
		case 'R': sb.append("r:Russia, ");break;
		case 'S': sb.append("r:Spain/Iberia, ");break;
		case 'U': sb.append("r:Eastern Europe, ");break;
		}
		
		switch (codes.charAt(3)) {
		case 'A': sb.append("f:very frequent, ");break;
		case 'B': sb.append("f:frequent, ");break;
		case 'C': sb.append("f:common, ");break;
		case 'D': sb.append("f:lesser, ");break;
		case 'E': sb.append("f:uncommon, ");break;
		case 'F': sb.append("f:very rare, ");break;
		case 'I': sb.append("f:inscription, ");break;
		case 'M': sb.append("f:grafffiti, ");break;
		case 'N': sb.append("f:Pliny, ");break;
		}
		switch (codes.charAt(4)) {
		case 'B': sb.append("s:Bee, ");break;
		case 'C': sb.append("s:CAS, ");break;
		case 'D': sb.append("s:Sex, ");break;
		case 'E': sb.append("s:Ecc, ");break;
		case 'F': sb.append("s:Def, ");break;
		case 'G': sb.append("s:G+L, ");break;
		case 'H': sb.append("s:Ouvrard, ");break;
		case 'I': sb.append("s:Leverett 1845, ");break;
		case 'K': sb.append("s:Cal, ");break;
		case 'L': sb.append("s:Levis 1891, ");break;
		case 'M': sb.append("s:Latham 1980, ");break;
		case 'N': sb.append("s:Nelson, ");break;
		case 'O': sb.append("s:OLD, ");break;
		case 'P': sb.append("s:Souter 1949, ");break;
		case 'Q': sb.append("s:(other), ");break;
		case 'S': sb.append("s:L+S, ");break;
		case 'T': sb.append("s:translation, ");break;
		case 'U': sb.append("s:DuCange, ");break;
		case 'V': sb.append("s:Saxo, ");break;
		case 'W': sb.append("s:guess, ");break;
		case 'Z': sb.append("s:user, ");break;
		}
		
		if (sb.length() > 0) {
			sb.setLength(sb.length() - 2);
		}

		return sb.toString();
	}
	
	public static String supertrim(String s) {
		StringBuilder sb = new StringBuilder(s.length());
		boolean wasSpace = true;
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			if (c <= ' ') {
				if (!wasSpace) {
					sb.append(' ');
					wasSpace = true;
				} 
			} else {
				sb.append(c);
				wasSpace = false;
			}
		}
		if (wasSpace && sb.length() > 0) {
			sb.setLength(sb.length() - 1);
		}		
		return sb.toString();
	}
	
	public static String cleanKind(String kind) {
		kind = supertrim(kind);
		int cut0 = kind.indexOf('(');
		int cut1 = kind.indexOf(')', cut0 + 1);
		if (cut0 != -1 && cut1 > cut0 + 1) {
			char d = kind.charAt(cut0+1);
			if (d >= '0' && d <= '9') {
				kind = kind.substring(0,  cut0) + d + kind.substring(cut1 + 1);
			}
		}
		return kind;
	}
	
	
	public static void main(String args[]) throws Exception {
		BufferedReader reader = new BufferedReader(new InputStreamReader(Converter.class.getResourceAsStream("dictpage.txt"), "iso-8859-1"));
		
		Writer out = new OutputStreamWriter(new FileOutputStream(new File("src/org/kobjects/nlp/latin/whitaker_converted.txt")), "utf-8");
		
		String nextLine = reader.readLine();
		do {
			String line = nextLine;
			nextLine = reader.readLine();
			
			while (nextLine != null && nextLine.indexOf('|') != -1) {
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
			
			String words = line.substring(1, cut0).trim();
			String kind = line.substring(cut0 + 2, cut1).trim();
			String codes = line.substring(cut1 + 1, cut1 + 7);
			String translation = line.substring(cut2 + 4).trim();
			
			// See http://archives.nd.edu/whitaker/wordsdoc.htm#Dictionary%20Codes
			
			kind = cleanKind(kind);
			String decoded = resolveCodes(codes);
			
			out.write(words);
			out.write("; ");
			out.write(kind);
			if (decoded.length() > 0) {
				out.write("; ");
				out.write(decoded);
			}
			out.write(" ::\n");
			
			String[] parts = translation.split(";");
			for (int i = 0; i < parts.length; i++) {
				out.write("  ");
				out.write(parts[i].trim());
				out.write(i < parts.length - 1 ? ";\n" : "\n");
			}
			
		} while (nextLine != null);
		
		out.close();
		
	}
	
}
