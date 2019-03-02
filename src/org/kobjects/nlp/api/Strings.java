package org.kobjects.nlp.api;

public class Strings {

  public static String[] splitAndTrim(String s, String deli) {
    String[] result = s.split(deli, -1);
    for (int i = 0; i < result.length; i++) {
      result[i] = result[i].trim();
    }
    return result;
  }

  public static String fill(String s, int len) {
     StringBuilder sb = new StringBuilder(len);
     sb.append(s);
     while (sb.length() < len) {
       sb.append(' ');
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

}
