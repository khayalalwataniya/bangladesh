(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "hold",
    label: "Hold",
    classButtonActive: "btnactive-blue"
  });

  enyo.kind({
    name: "TSRR.Model.HoldModel",
    order: null,
    message: null,
    printCode: null,
    printerProperty: null,
    productQty: null,
    description: null
  });

  enyo.kind({
    name: "TSRR.UI.HoldButton",
    kbd: null,
    holdModel: null,
    printCode: null,
    printerProperty: null,
    product: null,
    stateless: true,
    action: function(keyboard, txt) {
      var holdModel, kbd, templatereceipt;
      window.x = keyboard;
      console.log(keyboard);
      holdModel = void 0;
      kbd = void 0;
      templatereceipt = void 0;
      kbd = keyboard;
      return new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
        product: keyboard.line.attributes.product.id
      }, function(data) {
        if (data[0]) {
          holdModel = new TSRR.Model.HoldModel({
            order: keyboard.receipt,
            message: "Hold this item",
            printCode: data[0].printCode,
            printerProperty: data[0].printerProperty,
            productQty: String(kbd.line.attributes.qty),
            description: keyboard.line.attributes.description
          });
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.HoldTemplate);
          OB.POS.hwserver.print(templatereceipt, {
            order: holdModel,
            receiptNo: keyboard.receipt.attributes.documentNo,
            tableNo: keyboard.receipt.attributes.restaurantTable.name,
            guestNo: keyboard.receipt.attributes.numberOfGuests,
            user: keyboard.receipt.attributes.salesRepresentative$_identifier
          });
          OB.UTIL.showSuccess("Line on hold");
          return enyo.Signals.send("onTransmission", {
            message: 'held',
            cid: keyboard.line.cid
          });
        } else {
          OB.UTIL.showError("No printer is assigned to this product");
          return console.log("no data found");
        }
      });
    }
  });

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("hold", new TSRR.UI.HoldButton());

}).call(this);
