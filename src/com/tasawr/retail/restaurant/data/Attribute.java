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

public class Attribute extends ProcessHQLQuery {

  public static final String attributePropertyExtension = "AttributeExtension";
  static Logger log4j = Logger.getLogger(Attribute.class);

  @Inject
  @Any
  @Qualifier(attributePropertyExtension)
  private Instance<ModelExtension> extensions;

  @Override
  protected List<String> getQuery(JSONObject jsonsent) throws JSONException {

    HQLPropertyList attributeProperties = ModelExtensionUtils.getPropertyExtensions(extensions);

    log4j.debug("Attribute Class");

    return Arrays
        .asList(new String[] { "SELECT "
            + attributeProperties.getHqlSelect()
            + " from Attribute attr"
            + " where attr.active = true"
            + " and attr.$naturalOrgCriteria and attr.$readableClientCriteria and (attr.$incrementalUpdateCriteria)" });
  }
}
