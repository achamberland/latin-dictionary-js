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
			case 'A': sb.append("age=archaic, "); break;
			case 'B': sb.append("age=early, "); break;
			case 'C': sb.append("age=classical, "); break;
			case 'D': sb.append("age=late, "); break;
			case 'E': sb.append("age=later, "); break;
			case 'F': sb.append("age=medieval, "); break;
			case 'G': sb.append("age=scholar, "); break;
			case 'H': sb.append("age=modern, "); break;
		}
		switch (codes.charAt(1)) {
			case 'A': sb.append("cat=agr, "); break;
			case 'B': sb.append("cat=bio, "); break;
			case 'D': sb.append("cat=drm, "); break;
			case 'E': sb.append("cat=ecc, "); break;
			case 'G': sb.append("cat=grm, "); break;
			case 'L': sb.append("cat=leg, "); break;
			case 'P': sb.append("cat=poe, "); break;
			case 'S': sb.append("cat=sci, "); break;
			case 'T': sb.append("cat=tec, "); break;
			case 'W': sb.append("cat=war, "); break;
			case 'Y': sb.append("cat=myt, "); break;
		}
		switch (codes.charAt(2)) {
		case 'A': sb.append("reg=Aftrica, "); break;
		case 'B': sb.append("reg=Britain, ");break;
		case 'C': sb.append("reg=China, ");break;
		case 'D': sb.append("reg=Scandinavia, ");break;
		case 'E': sb.append("reg=Egypt, ");break;
		case 'F': sb.append("reg=France/Gaul, ");break;
		case 'G': sb.append("reg=Germany, ");break;
		case 'H': sb.append("reg=Greece, ");break;
		case 'I': sb.append("reg=Italy/Rome, ");break;
		case 'J': sb.append("reg=India, ");break;
		case 'K': sb.append("reg=Balkans, ");break;
		case 'N': sb.append("reg=Netherlands, ");break;
		case 'P': sb.append("reg=Persia, ");break;
		case 'Q': sb.append("reg=NearEast, ");break;
		case 'R': sb.append("reg=Russia, ");break;
		case 'S': sb.append("reg=Spain/Iberia, ");break;
		case 'U': sb.append("reg=Eastern Europe, ");break;
		}
		
		switch (codes.charAt(3)) {
		case 'A': sb.append("frq=+++, ");break;
		case 'B': sb.append("frq=++, ");break;
		case 'C': sb.append("frq=+, ");break;
		case 'D': sb.append("frq=-, ");break;
		case 'E': sb.append("frq=--, ");break;
		case 'F': sb.append("frq=---, ");break;
		case 'I': sb.append("frq=inscription, ");break;
		case 'M': sb.append("frq=grafffiti, ");break;
		case 'N': sb.append("frq=Pliny, ");break;
		}
		switch (codes.charAt(4)) {
		case 'B': sb.append("src=Bee, ");break;
		case 'C': sb.append("src=CAS, ");break;
		case 'D': sb.append("src=Sex, ");break;
		case 'E': sb.append("src=Ecc, ");break;
		case 'F': sb.append("sec=Def, ");break;
		case 'G': sb.append("src=G+L, ");break;
		case 'H': sb.append("src=Ouvrard, ");break;
		case 'I': sb.append("src=Leverett1845, ");break;
		case 'K': sb.append("src=Cal, ");break;
		case 'L': sb.append("src=Levis1891, ");break;
		case 'M': sb.append("src=Latham1980, ");break;
		case 'N': sb.append("src=Nelson, ");break;
		case 'O': sb.append("src=OLD, ");break;
		case 'P': sb.append("src=Souter1949, ");break;
		case 'Q': sb.append("src=other, ");break;
		case 'S': sb.append("src=L+S, ");break;
		case 'T': sb.append("src=translation, ");break;
		case 'U': sb.append("src=DuCange, ");break;
		case 'V': sb.append("src=Saxo, ");break;
		case 'W': sb.append("src=guess, ");break;
		case 'Z': sb.append("src=user, ");break;
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
			out.write(":\n");
			
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
