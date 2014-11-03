(function() {
  var assignVar, buildModel, getFilteredLines, prepareReceipt, printGenericLine, printLineOrReceipt, printNonGenericLine, productInfoGetter, uniquePrinterAndProductGenerator;

  TSRR.Main.TempVars.printersAndProducts = [];

  TSRR.Main.TempVars.allPrinters = [];

  TSRR.Main.TempVars.allProducts = [];

  TSRR.Main.TempVars.productsAndPrinters = [];

  TSRR.Main.TempVars.requests = [];

  uniquePrinterAndProductGenerator = function(callback, lines) {
    var description, i, j, prodQtyDesc, qty, tempProducts, uniquePrinters;
    callback(lines);
    qty = void 0;
    description = void 0;
    uniquePrinters = TSRR.Main.TempVars.allPrinters.filter(function(elem, pos) {
      return TSRR.Main.TempVars.allPrinters.indexOf(elem) === pos;
    });
    j = 0;
    while (j < uniquePrinters.length) {
      prodQtyDesc = new Array();
      tempProducts = new Array();
      i = 0;
      while (i < TSRR.Main.TempVars.productsAndPrinters.length) {
        if (($.inArray(uniquePrinters[j], TSRR.Main.TempVars.productsAndPrinters[i][1][0])) >= 0) {
          prodQtyDesc.push(TSRR.Main.TempVars.productsAndPrinters[i]);
        }
        i++;
      }
      TSRR.Main.TempVars.printersAndProducts[j] = [];
      TSRR.Main.TempVars.printersAndProducts[j][0] = uniquePrinters[j];
      TSRR.Main.TempVars.printersAndProducts[j][1] = prodQtyDesc;
      j++;
    }
    return TSRR.Main.TempVars.printersAndProducts;
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
          TSRR.Main.TempVars.allPrinters.push(tempPrinters[j]);
          j++;
        }
        TSRR.Main.TempVars.productsAndPrinters[i] = [];
        TSRR.Main.TempVars.productsAndPrinters[i][0] = data.printCode;
        TSRR.Main.TempVars.productsAndPrinters[i][1] = [tempPrinters];
        TSRR.Main.TempVars.productsAndPrinters[i][2] = lines.models[i].get('qty');
        TSRR.Main.TempVars.productsAndPrinters[i][3] = lines.models[i].get('description');
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
            product: lines.models[i].get('product').id,
            terminal: OB.POS.modelterminal.get('terminal').id
          })),
          cacheBust: false,
          sync: true,
          method: "GET",
          beforeSend: function(xhr) {
            return xhr.setRequestHeader("Authorization", "Basic " + btoa(OB.POS.modelterminal.user + ":" + OB.POS.modelterminal.password));
          },
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
        TSRR.Main.TempVars.requests.push(ajaxRequest);
      }
      i++;
    }
    $.when.apply(undefined, TSRR.Main.TempVars.requests).then(assignVar(TSRR.Main.TempVars.requests, lines));
    return TSRR.Main.TempVars.requests.length = 0;
  };

  prepareReceipt = function(keyboard) {
    if (typeof keyboard.receipt.attributes.numberOfGuests === "undefined") {
      keyboard.receipt.attributes.numberOfGuests = "Unspecified";
    }
    if (typeof keyboard.receipt.attributes.description === "undefined") {
      return console.error('receipt description not found');
    }
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

  printNonGenericLine = function(keyboard, messageParam, successMessage, lineMessage) {
    return new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec({
      product: keyboard.line.get('product').id,
      terminal: OB.POS.modelterminal.get('terminal').id
    }, function(data) {
      var sendModel, templatereceipt;
      if (data[0]) {
        sendModel = OB.UI.printingUtils.buildModel(keyboard, data, messageParam);
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

  printGenericLine = function(keyboard, gpi, message, statusMessage) {
    var newArray, sendToPrinter, templatereceipt;
    newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi);
    TSRR.Main.TempVars.productsAndPrinters = [];
    sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, newArray);
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.GenericLineTemplate);
    OB.POS.hwserver.print(templatereceipt, {
      order: sendToPrinter,
      receiptNo: keyboard.receipt.get('documentNo'),
      tableNo: JSON.parse(localStorage.getItem('currentTable')).name,
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name,
      guestNo: keyboard.receipt.get('numberOfGuests'),
      message: message,
      user: keyboard.receipt.get('salesRepresentative$_identifier')
    });
    _.each(newArray.models, function(model) {
      return enyo.Signals.send("onTransmission", {
        message: statusMessage,
        cid: model.cid
      });
    });
    OB.UTIL.showSuccess("Orders sent to printers successfully");
    newArray = null;
    return keyboard.receipt.trigger('scan');
  };

  printLineOrReceipt = function(keyboard, templatereceipt, sendToPrinter) {
    return OB.POS.hwserver.print(templatereceipt, {
      order: sendToPrinter,
      receiptNo: keyboard.receipt.get('documentNo'),
      tableNo: JSON.parse(localStorage.getItem('currentTable')).name,
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name,
      guestNo: keyboard.receipt.get('numberOfGuests'),
      user: keyboard.receipt.get('salesRepresentative$_identifier')
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
