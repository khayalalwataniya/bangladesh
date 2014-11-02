package com.tasawr.retail.restaurant.data;

import java.util.Arrays;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.openbravo.mobile.core.process.ProcessHQLQuery;

public class OrderLineService extends ProcessHQLQuery {
  private static final Logger log = Logger.getLogger(OrderLineService.class);

  @Override
  protected List<String> getQuery(JSONObject jsonsent) throws JSONException {
    
    log.info("inside OrderLineService data service\n");
    return Arrays.asList(new String[] { "from TSRR_Printprodcode where product.id=:product and pOSTerminal.id=:terminal" });
  }
  
}
