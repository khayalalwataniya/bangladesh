package com.tasawr.retail.restaurant;

import javax.servlet.ServletException;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.openbravo.retail.posterminal.JSONProcessSimple;

public class LockChecker extends JSONProcessSimple {

  @Override
  public JSONObject exec(JSONObject jsonsent) throws JSONException, ServletException {
      Object jsonorder = jsonsent.get("order");

      JSONArray array = null;
      if (jsonorder instanceof JSONObject) {
        array = new JSONArray();
        array.put(jsonorder);
      } else if (jsonorder instanceof String) {
        JSONObject obj = new JSONObject((String) jsonorder);
        array = new JSONArray();
        array.put(obj);
      } else if (jsonorder instanceof JSONArray) {
        array = (JSONArray) jsonorder;
      }
      
      
    JSONObject preFinalResult = new JSONObject();
    preFinalResult.put("isLocked", false);
    preFinalResult.put("myJson", array);
    JSONObject finalResult = new JSONObject();
    finalResult.put("data", preFinalResult);
    finalResult.put("status", 0);
    return finalResult;
  }

}
