(function() {
  var HoldModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  HoldModel = (function(_super) {
    __extends(HoldModel, _super);

    function HoldModel() {
      _ref = HoldModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HoldModel.prototype.order = null;

    HoldModel.prototype.message = null;

    HoldModel.prototype.printCode = null;

    HoldModel.prototype.printerProperty = null;

    HoldModel.prototype.productQty = null;

    HoldModel.prototype.description = null;

    return HoldModel;

  })(Backbone.Model);

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    i18nLabel: "TSRR_BtnHoldLineLabel",
    command: 'line:holdCommand',
    classButtonActive: "btnactive-blue",
    stateless: true,
    definition: {
      stateless: true,
      action: function(keyboard, txt) {
        var allLines, gpi, line, me, newArray, sendToPrinter, templatereceipt, _i, _len, _ref1;
        if (keyboard.receipt.get('numberOfGuests') === void 0) {
          keyboard.receipt.set('numberOfGuests', "1");
        }
        gpi = keyboard.line.attributes.product.attributes.generic_product_id;
        if (gpi !== null) {
          me = this;
          allLines = null;
          allLines = keyboard.receipt.get('lines');
          newArray = jQuery.extend(true, {}, keyboard.receipt.get('lines'));
          _ref1 = allLines.models;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            line = _ref1[_i];
            if (line.get('product').get('generic_product_id') === gpi) {
              console.info('present');
            } else {
              newArray.models.splice(newArray.models.indexOf(line), 1);
            }
          }
          window.productsAndPrinters = [];
          sendToPrinter = OB.UI.RestaurantUtils.uniquePrinterAndProductGenerator(OB.UI.RestaurantUtils.productInfoGetter, newArray);
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.HoldLinesTemplate);
          if (keyboard.receipt.attributes.restaurantTable === void 0) {
            keyboard.receipt.attributes.restaurantTable.name = "Unspecified";
          }
          if (keyboard.receipt.attributes.numberOfGuests === void 0) {
            keyboard.receipt.attributes.numberOfGuests = "Unspecified";
          }
          OB.POS.hwserver.print(templatereceipt, {
            order: sendToPrinter,
            receiptNo: keyboard.receipt.attributes.documentNo,
            tableNo: keyboard.receipt.attributes.restaurantTable.name,
            guestNo: keyboard.receipt.attributes.numberOfGuests,
            user: keyboard.receipt.attributes.salesRepresentative$_identifier
          });
          _.each(newArray.models, function(model) {
            return enyo.Signals.send("onTransmission", {
              message: 'held',
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
            var holdModel;
            if (data[0]) {
              holdModel = new HoldModel({
                order: keyboard.receipt,
                message: "Hold this item",
                printCode: data[0].printCode,
                printerProperty: data[0].printerProperty,
                productQty: String(keyboard.line.get('qty')),
                description: keyboard.line.get('description')
              });
              templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.HoldTemplate);
              OB.POS.hwserver.print(templatereceipt, {
                order: holdModel,
                receiptNo: keyboard.receipt.get('documentNo'),
                tableNo: keyboard.receipt.get('restaurantTable').name,
                guestNo: keyboard.receipt.get('numberOfGuests'),
                user: keyboard.receipt.get('salesRepresentative$_identifier')
              });
              enyo.Signals.send("onTransmission", {
                message: 'held',
                cid: keyboard.line.cid
              });
              return OB.UTIL.showSuccess("Line on hold");
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
