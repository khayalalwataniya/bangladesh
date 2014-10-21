(function() {
  var allPrinters, allProducts, assignVar, buildModel, getFilteredLines, prepareReceipt, printGenericLine, printLineOrReceipt, printNonGenericLine, printersAndProducts, productInfoGetter, requests, uniquePrinterAndProductGenerator;

  printersAndProducts = [];

  allPrinters = [];

  allProducts = [];

  window.productsAndPrinters = [];

  requests = [];

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

  prepareReceipt = function(keyboard) {
    if (keyboard.receipt.attributes.restaurantTable === void 0) {
      keyboard.receipt.attributes.restaurantTable.name = "Unspecified";
    }
    if (keyboard.receipt.attributes.numberOfGuests === void 0) {
      return keyboard.receipt.attributes.numberOfGuests = "Unspecified";
    }
  };

  printGenericLine = function(keyboard, gpi, message) {
    var newArray, sendToPrinter, templatereceipt;
    newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi);
    window.productsAndPrinters = [];
    sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, newArray);
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.GenericLineTemplate);
    OB.POS.hwserver.print(templatereceipt, {
      order: sendToPrinter,
      receiptNo: keyboard.receipt.attributes.documentNo,
      tableNo: keyboard.receipt.attributes.restaurantTable.name,
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name,
      guestNo: keyboard.receipt.attributes.numberOfGuests,
      message: message,
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
    return keyboard.receipt.trigger('scan');
  };

  buildModel = function(keyboard, data, message) {
    return new TSRR.Main.Model.GenericModelForPrinter({
      order: keyboard.receipt,
      message: message,
      printCode: data[0].printCode,
      printerProperty: data[0].printerProperty,
      productQty: String(keyboard.line.get('qty')),
      description: keyboard.line.get('description')
    });
  };

  getFilteredLines = function(keyboard, gpi) {
    var allLines, line, newArray, _i, _len, _ref;
    allLines = keyboard.receipt.get('lines');
    newArray = jQuery.extend(true, {}, keyboard.receipt.get('lines'));
    _ref = allLines.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      if (line.get('product').get('generic_product_id') === gpi) {
        console.info('present');
      } else {
        newArray.models.splice(newArray.models.indexOf(line), 1);
      }
    }
    return newArray;
  };

  printNonGenericLine = function(keyboard, message, successMessage, lineMessage) {
    return new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
      product: keyboard.line.get('product').id
    }, function(data) {
      var sendModel, templatereceipt;
      if (data[0]) {
        message = message;
        sendModel = OB.UI.printingUtils.buildModel(keyboard, data, message);
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.NonGenericLineTemplate);
        OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel);
        enyo.Signals.send("onTransmission", {
          message: lineMessage,
          cid: keyboard.line.cid
        });
        return OB.UTIL.showSuccess(successMessage);
      } else {
        return OB.UTIL.showError("No printer is assigned to this product");
      }
    });
  };

  printLineOrReceipt = function(keyboard, templatereceipt, sendToPrinter) {
    return OB.POS.hwserver.print(templatereceipt, {
      order: sendToPrinter,
      receiptNo: keyboard.receipt.attributes.documentNo,
      tableNo: keyboard.receipt.attributes.restaurantTable.name,
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name,
      guestNo: keyboard.receipt.attributes.numberOfGuests,
      user: keyboard.receipt.attributes.salesRepresentative$_identifier
    });
  };

  OB.UI.printingUtils = {
    uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator,
    productInfoGetter: productInfoGetter,
    assignVar: assignVar,
    prepareReceipt: prepareReceipt,
    printGenericLine: printGenericLine,
    buildModel: buildModel,
    getFilteredLines: getFilteredLines,
    printNonGenericLine: printNonGenericLine,
    printLineOrReceipt: printLineOrReceipt
  };

}).call(this);
