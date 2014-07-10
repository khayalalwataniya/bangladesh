package com.tasawr.retail.restaurant.data;

import java.util.ArrayList;
import java.util.List;

import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLProperty;
import org.openbravo.mobile.core.model.ModelExtension;

@Qualifier(BookingInfo.bookingInfoPropertyExtension)
public class BookingInfoProperties extends ModelExtension {

  @Override
  public List<HQLProperty> getHQLProperties(Object params) {
    ArrayList<HQLProperty> list = new ArrayList<HQLProperty>() {
      private static final long serialVersionUID = 1L;
      {
        add(new HQLProperty("bi.id", "id"));
        add(new HQLProperty("bi.restaurantTable.id", "restaurantTable"));
        add(new HQLProperty("bi.businessPartner.id", "businessPartner"));
        add(new HQLProperty("bi.salesOrder.id", "salesOrder"));
        add(new HQLProperty("bi.orderidlocal", "orderidlocal"));
        add(new HQLProperty("bi.ebid", "ebid"));
        add(new HQLProperty("bi.id", "_identifier"));
      }
    };
    return list;
  }

}
