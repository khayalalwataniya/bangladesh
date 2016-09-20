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

public class Table extends ProcessHQLQuery {

  public static final String tablePropertyExtension = "TSRR_TableExtension";

  @Inject
  @Any
  @Qualifier(tablePropertyExtension)
  private Instance<ModelExtension> extensions;
  

  @Override
  protected List<String> getQuery(JSONObject jsonsent) throws JSONException {
    HQLPropertyList tableProperties = ModelExtensionUtils.getPropertyExtensions(extensions);

    return Arrays.asList(new String[] { "SELECT " + tableProperties.getHqlSelect()
        + " from TSRR_Table tbl"
        + " where tbl.active = true"
        + " and tbl.$naturalOrgCriteria and tbl.$readableClientCriteria and (tbl.$incrementalUpdateCriteria)"
        + " order by tbl.name" });
  }
  
  @Override
  protected boolean bypassPreferenceCheck() {
    return true;
  }  
  
}
