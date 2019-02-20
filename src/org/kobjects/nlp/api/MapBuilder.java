package org.kobjects.nlp.api;

import java.util.LinkedHashMap;
import java.util.Map;

public class MapBuilder<K, V> {
    LinkedHashMap<K, V> map = new LinkedHashMap<>();
    
    public MapBuilder<K, V> put(K key, V value) {
     map.put(key, value);
     return this;
    }
    
    public Map<K, V> build() {
      return new LinkedHashMap<K, V>(map);
    }
}
