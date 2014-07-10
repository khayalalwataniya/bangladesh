package com.tasawr.retail.restaurant.data;

import java.util.ArrayList;
import java.util.List;

import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLProperty;
import org.openbravo.mobile.core.model.ModelExtension;

@Qualifier(Table.tablePropertyExtension)
public class TableProperties extends ModelExtension {

  @Override
  public List<HQLProperty> getHQLProperties(Object params) {
    ArrayList<HQLProperty> list = new ArrayList<HQLProperty>() {
      private static final long serialVersionUID = 1L;
      {
        add(new HQLProperty("tbl.id", "id"));
        add(new HQLProperty("tbl.name", "name"));
        add(new HQLProperty("tbl.tsrrSection.id", "tsrrSection"));
        add(new HQLProperty("tbl.smokingType", "smokingType"));
        add(new HQLProperty("tbl.chairs", "chairs"));
        add(new HQLProperty("tbl.locked", "locked"));
        add(new HQLProperty("tbl.locker", "locker"));
        add(new HQLProperty("tbl.name", "_identifier"));
        // add(new HQLProperty("tbl.tSRRBookingInfoList", "tSRRBookingInfoList"));
        // add(new HQLProperty("tbl.tSRRReservationList", "tSRRReservationList"));
      }
    };
    return list;
  }

}
