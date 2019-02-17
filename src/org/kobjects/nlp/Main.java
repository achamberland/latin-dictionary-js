package org.kobjects.nlp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.kobjects.nlp.api.Word;
import org.kobjects.nlp.latin.Latin;

public class Main {

	static String lettersOnly(String s) {
		StringBuilder sb = new StringBuilder(s.length());
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			switch (c) {
			case 'æ':
				sb.append("ae");
				break;
			default:
				if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
					sb.append(c);
				}
			}
		}
		return sb.length() == 0 ? s : sb.toString();
	}
	
	static String fill(String s, int len) {
		StringBuilder sb = new StringBuilder(s);
		while(sb.length() < len) {
			sb.append(' ');
		}
		return sb.toString();
	}
	
	public static void main(String[] args) throws IOException {
		
		Latin latin = new Latin();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		
		while (true) {
			System.out.println("input> ");

			String input = reader.readLine();
			if (input == null) {
				break;
			}

			String[] words = input.split(" ");
			
			for (String s : words) {
				s = lettersOnly(s.toLowerCase());
					
				
				Set<Word> options = latin.find(s);
				
				if (options == null) {
					System.out.println(fill(s, 15) + ": (not found)");
				} else {
					List<String> list = Word.toString(options);
					Iterator<String> i = list.iterator();
					System.out.println(fill(s, 15) + ": " + i.next());
					while (i.hasNext()) {
						System.out.println(fill("", 17) + i.next());
					}
					
				}
			}
			
		}
		
	}
	
}
