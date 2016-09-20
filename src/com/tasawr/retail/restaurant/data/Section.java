package com.tasawr.retail.restaurant.data;

import java.util.Arrays;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.log4j.Logger;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLPropertyList;
import org.openbravo.mobile.core.model.ModelExtension;
import org.openbravo.mobile.core.model.ModelExtensionUtils;
import org.openbravo.retail.posterminal.ProcessHQLQuery;

public class Section extends ProcessHQLQuery {

  public static final String sectionPropertyExtension = "TSRR_SectionExtension";

  public static final Logger log = Logger.getLogger(Section.class);

  @Inject
  @Any
  @Qualifier(sectionPropertyExtension)
  private Instance<ModelExtension> extensions;
  

  @Override
  protected List<String> getQuery(JSONObject jsonsent) throws JSONException {
    HQLPropertyList sectionProperties = ModelExtensionUtils.getPropertyExtensions(extensions);

    return Arrays.asList(new String[] { "SELECT " + sectionProperties.getHqlSelect()
        + " from TSRR_Section sec"
        + " where sec.active = true"
        + " and sec.$naturalOrgCriteria and sec.$readableClientCriteria and (sec.$incrementalUpdateCriteria)" });
  }
  
  @Override
  protected boolean bypassPreferenceCheck() {
    return true;
  }  
  
}
