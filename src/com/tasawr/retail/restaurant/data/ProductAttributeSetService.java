package com.tasawr.retail.restaurant.data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.ServletException;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.eclipse.jdt.internal.compiler.ast.ForeachStatement;
import org.hibernate.criterion.Restrictions;
import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.dal.core.OBContext;
import org.openbravo.dal.service.OBCriteria;
import org.openbravo.dal.service.OBDal;
import org.openbravo.erpCommon.utility.Utility;
import org.openbravo.financial.FinancialUtils;
import org.openbravo.mobile.core.model.HQLPropertyList;
import org.openbravo.mobile.core.model.ModelExtension;
import org.openbravo.mobile.core.model.ModelExtensionUtils;
import org.openbravo.mobile.core.process.JSONProcessSimple;
import org.openbravo.model.common.businesspartner.BusinessPartner;
import org.openbravo.model.common.plm.Attribute;
import org.openbravo.model.common.plm.AttributeSet;
import org.openbravo.model.common.plm.AttributeUse;
import org.openbravo.model.common.plm.AttributeValue;
import org.openbravo.model.common.plm.Product;
import org.openbravo.retail.posterminal.ProcessHQLQuery;
import org.openbravo.service.json.JsonConstants;
import org.openbravo.service.system.RestartTomcat;

public class ProductAttributeSetService extends JSONProcessSimple {

  static Logger log4j = Logger.getLogger(ProductAttributeSetService.class);

  @Override
  public JSONObject exec(JSONObject jsonsent) throws JSONException, ServletException {

    HashMap<String, List<String>> attributeMap = new HashMap<String, List<String>>();

    try {
      OBContext.setAdminMode(true);
      String productId = jsonsent.getString("id");
      Product product = (Product) OBDal.getInstance().createCriteria(Product.class)
          .add(Restrictions.eq(Product.PROPERTY_ID, productId)).list().get(0);

      AttributeSet attributeSet = (AttributeSet) OBDal.getInstance()
          .createCriteria(AttributeSet.class)
          .add(Restrictions.eq(AttributeSet.PROPERTY_ID, product.getAttributeSet().getId())).list()
          .get(0);

      @SuppressWarnings("unchecked")
      OBCriteria<AttributeUse> crtAttributeUses = (OBCriteria<AttributeUse>) OBDal.getInstance()
          .createCriteria(AttributeUse.class)
          .add(Restrictions.eq(AttributeUse.PROPERTY_ATTRIBUTESET, attributeSet));

      List<AttributeUse> lstAttributeUse = crtAttributeUses.list();

      for (AttributeUse attributeUse : lstAttributeUse) {

        Attribute tempAttribute = (Attribute) OBDal.getInstance().createCriteria(Attribute.class)
            .add(Restrictions.eq(Attribute.PROPERTY_ID, attributeUse.getAttribute().getId()))
            .list().get(0);

        String strTempAttribute = tempAttribute.getIdentifier();

        @SuppressWarnings("unchecked")
        List<AttributeValue> lstAttributeValue = OBDal.getInstance()
            .createCriteria(AttributeValue.class)
            .add(Restrictions.eq(AttributeValue.PROPERTY_ATTRIBUTE, tempAttribute)).list();

        List<String> lstStrAttributeValues = new ArrayList<String>();
        for (AttributeValue av : lstAttributeValue) {
          lstStrAttributeValues.add(av.getIdentifier());
        }
        attributeMap.put(strTempAttribute, lstStrAttributeValues);

      }

      log4j.debug(attributeMap);

    } finally {
      OBContext.restorePreviousMode();
    }
    JSONObject result = new JSONObject();
    result.put(JsonConstants.RESPONSE_DATA, attributeMap);
    result.put(JsonConstants.RESPONSE_STATUS, JsonConstants.RPCREQUEST_STATUS_SUCCESS);

    return result;

  }

  @Override
  protected boolean bypassSecurity() {
    return true;
  }

  @Override
  protected boolean bypassPreferenceCheck() {
    return true;
  }
}
