(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_BtnSendLineLabel",
    command: 'line:sendCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        var gpi;
        OB.UI.printingUtils.prepareReceipt(keyboard);
        gpi = keyboard.line.attributes.product.attributes.generic_product_id;
        if (gpi !== null) {
          OB.UI.printingUtils.printGenericLine(keyboard, gpi, "Send these lines");
          return;
        } else {
          OB.UI.printingUtils.printNonGenericLine(keyboard, "Send This Item", "Line sent", "sent");
        }
        keyboard.receipt.trigger('scan');
      }
    }
  });

}).call(this);
