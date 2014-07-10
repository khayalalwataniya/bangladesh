
package com.tasawr.retail.restaurant.data;

import java.util.ArrayList;
import java.util.List;

import org.openbravo.client.kernel.ComponentProvider.Qualifier;
import org.openbravo.mobile.core.model.HQLProperty;
import org.openbravo.mobile.core.model.ModelExtension;

@Qualifier(Section.sectionPropertyExtension)
public class SectionProperties extends ModelExtension {

  @Override
  public List<HQLProperty> getHQLProperties(Object params) {
    ArrayList<HQLProperty> list = new ArrayList<HQLProperty>() {
      private static final long serialVersionUID = 1L;
      {
        add(new HQLProperty("sec.id", "id"));
        add(new HQLProperty("sec.name", "name"));
        // add(new HQLProperty("sec.tSRRTableList", "tSRRTableList"));
      }
    };
    return list;
  }

}
