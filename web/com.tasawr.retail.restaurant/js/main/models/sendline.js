(function() {
  var allPrinters, allProducts, assignVar, printersAndProducts, productInfoGetter, requests, uniquePrinterAndProductGenerator;

  OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push({
    command: 'send',
    i18nLabel: 'TSRR_BtnSendLineLabel',
    stateless: true,
    definition: {
      stateless: true,
      kbd: null,
      sendModel: null,
      printCode: null,
      printerProperty: null,
      product: null,
      stateless: true,
      action: function(keyboard, txt) {
        var allLines, gpi, kbd, line, me, newArray, sendModel, sendToPrinter, templatereceipt, _i, _len, _ref;
        me = this;
        kbd = void 0;
        sendModel = void 0;
        templatereceipt = void 0;
        sendModel = void 0;
        templatereceipt = void 0;
        kbd = keyboard;
        if (keyboard.receipt.attributes.numberOfGuests === void 0) {
          keyboard.receipt.attributes.numberOfGuests = "Unspecified";
        }
        gpi = keyboard.line.attributes.product.attributes.generic_product_id;
        if (gpi !== null) {
          me = this;
          allLines = null;
          allLines = keyboard.receipt.get('lines');
          newArray = jQuery.extend(true, {}, keyboard.receipt.get('lines'));
          _ref = allLines.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            if (line.get('product').get('generic_product_id') === gpi) {
              console.error('present');
            } else {
              newArray.models.splice(newArray.models.indexOf(line), 1);
            }
          }
          debugger;
          window.productsAndPrinters = [];
          sendToPrinter = uniquePrinterAndProductGenerator(productInfoGetter, newArray);
          templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate);
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
              message: 'sent',
              cid: model.cid
            });
          });
          OB.UTIL.showSuccess("Orders sent to printers successfully");
          newArray = null;
          keyboard.receipt.trigger('scan');
          return;
        } else {
          new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
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
        keyboard.receipt.trigger('scan');
      }
    }
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

  uniquePrinterAndProductGenerator = function(callback, lines) {
    var description, i, j, prodQtyDesc, qty, tempProducts, uniquePrinters;
    callback(lines);
    qty = void 0;
    description = void 0;
    uniquePrinters = allPrinters.filter(function(elem, pos) {
      return allPrinters.indexOf(elem) === pos;
    });
    j = 0;
    while (j < uniquePrinters.length) {
      prodQtyDesc = new Array();
      tempProducts = new Array();
      i = 0;
      while (i < productsAndPrinters.length) {
        if (($.inArray(uniquePrinters[j], productsAndPrinters[i][1][0])) >= 0) {
          prodQtyDesc.push(productsAndPrinters[i]);
        }
        i++;
      }
      printersAndProducts[j] = [];
      printersAndProducts[j][0] = uniquePrinters[j];
      printersAndProducts[j][1] = prodQtyDesc;
      j++;
    }
    return printersAndProducts;
  };

  assignVar = function(requests, lines) {
    var data, i, j, result, tempPrinters, _results;
    tempPrinters = [];
    i = 0;
    _results = [];
    while (i < requests.length) {
      result = JSON.parse(requests[i].xhr.responseText);
      data = result.response.data[0];
      if (data) {
        tempPrinters = data.printerProperty.split(" ");
        j = 0;
        while (j < tempPrinters.length) {
          allPrinters.push(tempPrinters[j]);
          j++;
        }
        productsAndPrinters[i] = [];
        productsAndPrinters[i][0] = data.printCode;
        productsAndPrinters[i][1] = [tempPrinters];
        productsAndPrinters[i][2] = lines.models[i].attributes.qty;
        productsAndPrinters[i][3] = lines.models[i].attributes.description;
      }
      _results.push(i++);
    }
    return _results;
  };

  productInfoGetter = function(lines) {
    var ajaxRequest, i;
    i = 0;
    while (i < lines.length) {
      if (i >= lines.models.length) {
        break;
      } else {
        ajaxRequest = new enyo.Ajax({
          url: "../../org.openbravo.mobile.core.service.jsonrest/" + "com.tasawr.retail.restaurant.data.OrderLineService" + "/" + encodeURI(JSON.stringify({
            product: lines.models[i].attributes.product.id
          })),
          cacheBust: false,
          sync: true,
          method: "GET",
          handleAs: "json",
          contentType: "application/json;charset=utf-8",
          success: function(inSender, inResponse) {
            return {
              fail: function(inSender, inResponse) {
                return console.log("failed");
              }
            };
          }
        });
        ajaxRequest.go().response("success").error("fail");
        requests.push(ajaxRequest);
      }
      i++;
    }
    $.when.apply(undefined, requests).then(assignVar(requests, lines));
    return requests.length = 0;
  };

  printersAndProducts = [];

  allPrinters = [];

  allProducts = [];

  window.productsAndPrinters = [];

  requests = [];

}).call(this);
