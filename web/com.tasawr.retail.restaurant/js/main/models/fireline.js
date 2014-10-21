(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_BtnFireLineLabel",
    command: 'line:fireCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        var gpi, newArray, sendToPrinter, templatereceipt;
        OB.UI.printingUtils.prepareReceipt(keyboard);
        gpi = keyboard.line.attributes.product.attributes.generic_product_id;
        if (gpi !== null) {
          newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi);
          window.productsAndPrinters = [];
          sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, newArray);
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.FireLinesTemplate);
          OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendToPrinter);
          _.each(newArray.models, function(model) {
            return enyo.Signals.send("onTransmission", {
              message: 'fired',
              cid: model.cid
            });
          });
          OB.UTIL.showSuccess("Orders sent to printers successfully");
          newArray = null;
          keyboard.receipt.trigger('scan');
          return;
        } else {
          new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
            product: keyboard.line.get('product').id
          }, function(data) {
            var message, sendModel;
            if (data[0]) {
              message = "Fire this item";
              sendModel = OB.UI.printingUtils.buildModel(keyboard, data, message);
              templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.FireTemplate);
              OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel);
              enyo.Signals.send("onTransmission", {
                message: 'fired',
                cid: keyboard.line.cid
              });
              return OB.UTIL.showSuccess("Line Fired");
            } else {
              return OB.UTIL.showError("No printer is assigned to this product");
            }
          });
        }
        keyboard.receipt.trigger('scan');
      }
    }
  });

}).call(this);
