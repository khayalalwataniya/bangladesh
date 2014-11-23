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
import org.apache.log4j.Logger;

public class Printprodcode extends ProcessHQLQuery {

  public static final String printprodcodePropertyExtension = "TSRR_PrintprodcodeExtension";
  public static final Logger log = Logger.getLogger(Printprodcode.class);

  @Inject
  @Any
  @Qualifier(printprodcodePropertyExtension)
  private Instance<ModelExtension> extensions;

  @Override
  protected List<String> getQuery(JSONObject jsonsent) throws JSONException {
    HQLPropertyList printprodcodeProperties = ModelExtensionUtils.getPropertyExtensions(extensions);

    
    log.debug("inside print productcode properties");
    log.debug(printprodcodeProperties.getHqlSelect());

    // return Arrays
    //     .asList(new String[] { "SELECT "
    //         + printprodcodeProperties.getHqlSelect()
    //         + " from TSRR_Printprodcode ppc"
    //         + " where ppc.active = true"
    //         + " and ppc.$naturalOrgCriteria and ppc.$readableClientCriteria and (ppc.$incrementalUpdateCriteria)" });
    return Arrays
        .asList(new String[] {"From TSRR_Printprodcode ppc"
            + " where ppc.active = true"
            + " and ppc.$naturalOrgCriteria and ppc.$readableClientCriteria and (ppc.$incrementalUpdateCriteria)" });
  }

  @Override
  protected boolean bypassPreferenceCheck() {
    return true;
  }

}
