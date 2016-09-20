package com.tasawr.retail.restaurant.data;

import java.util.ArrayList;
import java.util.List;

import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLProperty;
import org.openbravo.mobile.core.model.ModelExtension;

@Qualifier(Attribute.attributePropertyExtension)
public class AttributeProperties extends ModelExtension {

  @Override
  public List<HQLProperty> getHQLProperties(Object params) {
    ArrayList<HQLProperty> list = new ArrayList<HQLProperty>() {
      private static final long serialVersionUID = 1L;
      {
        add(new HQLProperty("attr.id", "id"));
        add(new HQLProperty("attr.name", "name"));
        add(new HQLProperty("attr.description", "description"));
        add(new HQLProperty("attr.mandatory", "mandatory"));
        add(new HQLProperty("attr.list", "list"));

      }
    };
    return list;
  }

}
