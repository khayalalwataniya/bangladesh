package com.tasawr.retail.restaurant.data;

import java.util.Arrays;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLPropertyList;
import org.openbravo.mobile.core.model.ModelExtension;
import org.openbravo.mobile.core.model.ModelExtensionUtils;
import org.openbravo.retail.posterminal.ProcessHQLQuery;

public class BookingInfo extends ProcessHQLQuery {

  public static final String bookingInfoPropertyExtension = "TSRR_BookingInfoExtension";

  @Inject
  @Any
  @Qualifier(bookingInfoPropertyExtension)
  private Instance<ModelExtension> extensions;
  

  @Override
  protected List<String> getQuery(JSONObject jsonsent) throws JSONException {
    HQLPropertyList bookingInfoProperties = ModelExtensionUtils.getPropertyExtensions(extensions);

    return Arrays.asList(new String[] { "SELECT " + bookingInfoProperties.getHqlSelect()
        + " from TSRR_BookingInfo bi"
        + " where bi.active = true"
        + " and bi.$naturalOrgCriteria and bi.$readableClientCriteria and (bi.$incrementalUpdateCriteria)" });
  }
  
  @Override
  protected boolean bypassPreferenceCheck() {
    return true;
  }
  
}
