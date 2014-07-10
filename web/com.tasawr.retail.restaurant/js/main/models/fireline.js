(function() {
  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: "fire",
    label: "Fire",
    classButtonActive: "btnactive-blue"
  });

  enyo.kind({
    name: "TSRR.Model.FireModel",
    order: null,
    message: null,
    printCode: null,
    printerProperty: null,
    productQty: null,
    description: null
  });

  enyo.kind({
    name: "TSRR.UI.FireButton",
    kbd: null,
    fireModel: null,
    printCode: null,
    printerProperty: null,
    product: null,
    stateless: true,
    action: function(keyboard, txt) {
      var fireModel, kbd, templatereceipt;
      fireModel = void 0;
      kbd = void 0;
      templatereceipt = void 0;
      kbd = keyboard;
      return new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
        product: keyboard.line.attributes.product.id
      }, function(data) {
        if (data[0]) {
          fireModel = new TSRR.Model.FireModel({
            order: keyboard.receipt,
            message: "Fire this item",
            printCode: data[0].printCode,
            printerProperty: data[0].printerProperty,
            productQty: String(kbd.line.attributes.qty),
            description: keyboard.line.attributes.description
          });
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.FireTemplate);
          OB.POS.hwserver.print(templatereceipt, {
            order: fireModel
          });
          OB.UTIL.showSuccess("Line fired");
          return enyo.Signals.send("onTransmission", {
            message: 'fire',
            cid: keyboard.line.cid
          });
        } else {
          OB.UTIL.showError("No printer is assigned to this product");
          return console.log("no data found");
        }
      });
    }
  });

  OB.OBPOSPointOfSale.UI.KeyboardOrder.prototype.addCommand("fire", new TSRR.UI.FireButton());

}).call(this);
