package com.tasawr.retail.restaurant;
 
import java.util.ArrayList;
import java.util.List;

import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLProperty;
import org.openbravo.mobile.core.model.ModelExtension;
import org.openbravo.retail.posterminal.master.Product;

@Qualifier(Product.productPropertyExtension)
public class NewProductProperties extends ModelExtension {

  @Override
  public List<HQLProperty> getHQLProperties(Object params) {
    ArrayList<HQLProperty> list = new ArrayList<HQLProperty>() {
      private static final long serialVersionUID = 1L;
      {
        add(new HQLProperty("product.weight", "weight"));
        add(new HQLProperty("product.attributeSet.id", "attributeSet"));
        //add(new HQLProperty("product.attributeSetValue", "attributeSetValue"));
      }
    };
    return list;
  }
  
}
