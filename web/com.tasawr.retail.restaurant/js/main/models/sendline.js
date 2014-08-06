(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "send",
    label: "Send",
    classButtonActive: "btnactive-blue"
  });

  enyo.kind({
    name: "TSRR.Model.SendModel",
    order: null,
    message: null,
    printCode: null,
    printerProperty: null,
    productQty: null,
    description: null
  });

  enyo.kind({
    name: "TSRR.UI.SendButton",
    kbd: null,
    sendModel: null,
    printCode: null,
    printerProperty: null,
    product: null,
    stateless: true,
    action: function(keyboard, txt) {
      var kbd, sendModel, templatereceipt;
      kbd = void 0;
      sendModel = void 0;
      templatereceipt = void 0;
      sendModel = void 0;
      templatereceipt = void 0;
      kbd = keyboard;
      window.asdf = keyboard;
      return new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
        product: keyboard.line.attributes.product.id
      }, function(data) {
        if (data[0]) {
          window.asdf = keyboard;
          sendModel = new TSRR.Model.SendModel({
            order: keyboard.receipt,
            message: "Send this item",
            printCode: data[0].printCode,
            printerProperty: data[0].printerProperty,
            productQty: String(kbd.line.attributes.qty),
            description: keyboard.line.attributes.description
          });
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendTemplate);
          OB.POS.hwserver.print(templatereceipt, {
            order: sendModel,
            receiptNo: keyboard.receipt.attributes.documentNo,
            tableNo: keyboard.receipt.attributes.restaurantTable.name,
            guestNo: keyboard.receipt.attributes.numberOfGuests,
            user: keyboard.receipt.attributes.salesRepresentative$_identifier
          });
          OB.UTIL.showSuccess("Line sent");
          return enyo.Signals.send("onTransmission", {
            message: 'sent',
            cid: keyboard.line.cid
          });
        } else {
          OB.UTIL.showError("No printer is assigned to this product");
          return console.log("no data found");
        }
      });
    }
  });

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("send", new TSRR.UI.SendButton());

}).call(this);
