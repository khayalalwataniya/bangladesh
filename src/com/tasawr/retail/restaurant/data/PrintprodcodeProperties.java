package com.tasawr.retail.restaurant.data;


import java.util.ArrayList;
import java.util.List;

import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLProperty;
import org.openbravo.mobile.core.model.ModelExtension;

import org.apache.log4j.Logger;
@Qualifier(Printprodcode.printprodcodePropertyExtension)

public class PrintprodcodeProperties extends ModelExtension {
public static final Logger log = Logger.getLogger(PrintprodcodeProperties.class);

  @Override
  public List<HQLProperty> getHQLProperties(Object params) {
    ArrayList<HQLProperty> list = new ArrayList<HQLProperty>() {
      private static final long serialVersionUID = 1L;
      {
        log.debug("inside model exetension");
        add(new HQLProperty("ppc.id", "id"));
        add(new HQLProperty("ppc.printCode", "printCode"));
        // add(new HQLProperty("sec.tSRRTableList", "tSRRTableList"));
      }
    };
    return list;
  }

}
