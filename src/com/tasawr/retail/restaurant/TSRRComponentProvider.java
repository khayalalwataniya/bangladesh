package com.tasawr.retail.restaurant;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;

import org.openbravo.client.kernel.BaseComponentProvider;
import org.openbravo.client.kernel.Component;
import org.openbravo.client.kernel.ComponentProvider;
import org.openbravo.client.kernel.KernelConstants;
import org.openbravo.client.kernel.BaseComponentProvider.ComponentResource.ComponentResourceType;
import org.openbravo.retail.posterminal.POSUtils;

@ApplicationScoped
@ComponentProvider.Qualifier(TSRRComponentProvider.QUALIFIER)
public class TSRRComponentProvider extends BaseComponentProvider {
  public static final String QUALIFIER = "TSRR_Main";
  public static final String MODULE_JAVA_PACKAGE = "com.tasawr.retail.restaurant";

  @Override
  public Component getComponent(String componentId, Map<String, Object> parameters) {
    throw new IllegalArgumentException("Component id " + componentId + " not supported.");
  }
  
  @Override
  public List<String> getTestResources() {
    return Collections.emptyList();
  }  

  @Override
  public List<ComponentResource> getGlobalComponentResources() {

    final GlobalResourcesHelper grhelper = new GlobalResourcesHelper();


    grhelper.add("main.js");
    grhelper.add("tables/namespaces.js");
    
    grhelper.add("main/views/SplitButton.js");
    grhelper.add("main/views/changeDefaultTemplates.js");

    grhelper.add("main/models/holdline.js");
    grhelper.add("main/models/fireline.js");
    grhelper.add("main/models/sendorder.js");
    grhelper.add("main/models/cancelline.js");
    grhelper.add("main/models/sendline.js");
    grhelper.add("main/models/product-override.js");
    grhelper.add("main/models/orderLineOverride.js");
    
    grhelper.add("main/models/genericModelForPrinter.js");

    grhelper.add("main/models/Attribute.js");
    grhelper.add("main/models/AttributeInstance.js");
    grhelper.add("main/models/AttributeSet.js");
    grhelper.add("main/models/AttributeSetInstance.js");
    grhelper.add("main/models/AttributeUse.js");
    grhelper.add("main/models/AttributeValue.js");

    grhelper.add("main/components/payment-override.js");
    grhelper.add("main/components/scan-override.js");
    grhelper.add("main/components/renderorderline-override.js");
    grhelper.add("main/components/modalreceiptlineproperties-override.js");
    grhelper.add("main/components/editline-override.js");
    grhelper.add("main/components/background-override.js");
    grhelper.add("main/components/modalreceipts-override.js");
    grhelper.add("main/components/splitorderpopup.js");
    grhelper.add("main/components/listOrdersForSplitting.js");


    grhelper.add("main/views/RestaurantUtils.js");
    grhelper.add("main/views/printingUtils.js");

    grhelper.add("main/components/RestaurantDialog.js");
    grhelper.add("main/components/RestaurantSearchDialog.js");


    grhelper.add("tables/models/sections.js");
    grhelper.add("tables/models/tables.js");
    grhelper.add("tables/models/bookingInfos.js");
    grhelper.add("tables/models/tablesWindow.js");
    grhelper.add("tables/models/changedbookinginfo.js");
          
    grhelper.add("tables/data/databookinginfosave.js");      
    
    grhelper.add("tables/components/WebPOS.Table/Table.WebPOS.js");
    grhelper.add("tables/components/sectionMenu.js");
    grhelper.add("tables/components/table.js");
    grhelper.add("tables/views/tables.js");

    

    // grhelper.add(".js");

    return grhelper.getGlobalResources();
  }

  private class GlobalResourcesHelper {
    private final List<ComponentResource> globalResources = new ArrayList<ComponentResource>();
    private final String prefix = "web/" + MODULE_JAVA_PACKAGE + "/js/";

    public void add(String file) {
      globalResources.add(createComponentResource(ComponentResourceType.Static, prefix + file,
          POSUtils.APP_NAME));
    }

    public List<ComponentResource> getGlobalResources() {
      return globalResources;
    }
  }
}
