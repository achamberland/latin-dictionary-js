package org.kobjects.nlp.api;

public class Strings {

  public static String[] splitAndTrim(String s, String deli) {
    String[] result = s.split(deli);
    for (int i = 0; i < result.length; i++) {
      result[i] = result[i].trim();
    }
    return result;
  }

}
