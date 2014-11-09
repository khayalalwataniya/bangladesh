(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_BtnHoldLineLabel",
    command: 'line:holdCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        var gpi;
        OB.UI.printingUtils.prepareReceipt(keyboard);
        gpi = keyboard.line.attributes.product.attributes.generic_product_id;
        if (gpi !== null) {
          OB.UI.printingUtils.printGenericLine(keyboard, gpi, "Hold these lines", "held");
          return;
        } else {
          OB.UI.printingUtils.printNonGenericLine(keyboard, "Hold This Item", "Line held", "held");
        }
        keyboard.receipt.trigger('scan');
      }
    }
  });

}).call(this);
