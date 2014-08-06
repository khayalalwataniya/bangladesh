(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "cancel",
    label: "Cancel",
    classButtonActive: "btnactive-blue"
  });

  enyo.kind({
    name: "TSRR.Model.CancelModel",
    order: null,
    message: null,
    printCode: null,
    printerProperty: null,
    productQty: null,
    description: null
  });

  enyo.kind({
    name: "TSRR.UI.CancelButton",
    kbd: null,
    cancelModel: null,
    printCode: null,
    printerProperty: null,
    product: null,
    stateless: true,
    action: function(keyboard, txt) {
      var cancelModel, kbd, templatereceipt;
      cancelModel = void 0;
      kbd = void 0;
      templatereceipt = void 0;
      cancelModel = void 0;
      templatereceipt = void 0;
      kbd = keyboard;
      return new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
        product: keyboard.line.attributes.product.id
      }, function(data) {
        if (data[0]) {
          cancelModel = new TSRR.Model.CancelModel({
            order: keyboard.receipt,
            message: "Cancel this item",
            printCode: data[0].printCode,
            printerProperty: data[0].printerProperty,
            productQty: String(kbd.line.attributes.qty),
            description: keyboard.line.attributes.description
          });
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelTemplate);
          OB.POS.hwserver.print(templatereceipt, {
            order: cancelModel,
            receiptNo: keyboard.receipt.attributes.documentNo,
            tableNo: keyboard.receipt.attributes.restaurantTable.name,
            guestNo: keyboard.receipt.attributes.numberOfGuests,
            user: keyboard.receipt.attributes.salesRepresentative$_identifier
          });
          OB.UTIL.showSuccess("Line cancelled");
          return enyo.Signals.send("onTransmission", {
            message: 'cancelled',
            cid: keyboard.line.cid
          });
        } else {
          OB.UTIL.showError("No printer is assigned to this product");
          return console.log("no data found");
        }
      });
    }
  });

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("cancel", new TSRR.UI.CancelButton());

}).call(this);
