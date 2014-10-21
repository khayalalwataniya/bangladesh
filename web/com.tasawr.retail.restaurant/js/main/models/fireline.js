(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_BtnFireLineLabel",
    command: 'line:fireCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        var gpi;
        OB.UI.printingUtils.prepareReceipt(keyboard);
        gpi = keyboard.line.attributes.product.attributes.generic_product_id;
        if (gpi !== null) {
          OB.UI.printingUtils.printGenericLine(keyboard, gpi, "Fire these lines");
          return;
        } else {
          OB.UI.printingUtils.printNonGenericLine(keyboard, "Fire This Item", "Line fired", "fired");
        }
        keyboard.receipt.trigger('scan');
      }
    }
  });

}).call(this);
