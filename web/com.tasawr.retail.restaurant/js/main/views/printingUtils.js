(function() {
  var assignVar, assignVar2, buildModel, buildModel2, filterAlreadySent, findModel, getFilteredLines, prepareReceipt, printGenericLine, printLineOrReceipt, printNonGenericLine, productInfoGetter, productInfoGetter2, uniquePrinterAndProductGenerator, uniquePrinterAndProductGenerator2,
    __slice = [].slice;

  TSRR.Main.TempVars.printersAndProducts = [];

  TSRR.Main.TempVars.allPrinters = [];

  TSRR.Main.TempVars.allProducts = [];

  TSRR.Main.TempVars.productsAndPrinters = [];

  TSRR.Main.TempVars.requests = [];

  TSRR.Main.TempVars.localModels = [];

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
    TSRR.Main.TempVars.productsAndPrinters = [];
    return TSRR.Main.TempVars.printersAndProducts;
  };

  uniquePrinterAndProductGenerator2 = function() {
    var description, i, j, prodQtyDesc, qty, tempProducts, uniquePrinters;
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
    TSRR.Main.TempVars.productsAndPrinters = [];
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
      console.error('there ');
      console.error(data);
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

  assignVar2 = function(collection, lines) {
    var data, i, j, tempPrinters, _results;
    tempPrinters = [];
    i = 0;
    _results = [];
    while (i < collection.length) {
      data = collection[i].models[0];
      if (data) {
        tempPrinters = data.get('printerProperty').split(" ");
        j = 0;
        while (j < tempPrinters.length) {
          TSRR.Main.TempVars.allPrinters.push(tempPrinters[j]);
          j++;
        }
        TSRR.Main.TempVars.productsAndPrinters[i] = [];
        TSRR.Main.TempVars.productsAndPrinters[i][0] = data.get('printCode');
        TSRR.Main.TempVars.productsAndPrinters[i][1] = [tempPrinters];
        TSRR.Main.TempVars.productsAndPrinters[i][2] = lines._wrapped[i].get('qty');
        TSRR.Main.TempVars.productsAndPrinters[i][3] = lines._wrapped[i].get('description');
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

  productInfoGetter2 = function(lines) {
    var line, promise, promises, _i, _len, _ref;
    promises = [];
    _ref = lines._wrapped;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      promise = findModel(OB.Model.Printprodcode, {
        product: line.get("product").id,
        pOSTerminal: OB.POS.modelterminal.get("terminal").id
      });
      promises.push(promise);
    }
    return promises;
  };

  findModel = function(model, params) {
    var deferred;
    deferred = $.Deferred();
    OB.Dal.find(model, params, (function(data) {
      return deferred.resolve(data);
    }), function(err) {
      return deferred.reject(err);
    });
    return deferred.promise();
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

  buildModel2 = function(keyboard, data, message) {
    return new TSRR.Main.Model.GenericModelForPrinter({
      order: keyboard.receipt,
      message: message,
      printCode: data.models[0].get('printCode'),
      printerProperty: data.models[0].get('printerProperty'),
      productQty: String(keyboard.line.get('qty')),
      description: keyboard.line.get('description')
    });
  };

  getFilteredLines = function(keyboard, gpi) {
    var allLines, newArray;
    allLines = keyboard.receipt.get('lines');
    newArray = _(allLines.filter(function(line) {
      return line.attributes.product.attributes.generic_product_id === gpi;
    }));
    return newArray;
  };

  printNonGenericLine = function(keyboard, messageParam, successMessage, lineMessage) {
    OB.Dal.find(OB.Model.Printprodcode, {
      product: keyboard.line.get('product').id,
      pOSTerminal: OB.POS.modelterminal.get('terminal').id
    }, (function(model) {
      var sendModel, templatereceipt;
      if (model.models[0]) {
        sendModel = OB.UI.printingUtils.buildModel2(keyboard, model, messageParam);
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.NonGenericLineTemplate);
        OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel);
        enyo.Signals.send("onTransmission", {
          message: lineMessage,
          keyboard: keyboard
        });
        return OB.UTIL.showSuccess(successMessage);
      } else {
        return OB.UTIL.showError("No printer is assigned to this product");
      }
    }), function() {
      console.error("error");
    });
  };

  printGenericLine = function(keyboard, gpi, message, statusMessage) {
    var newArray, promises;
    newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi);
    TSRR.Main.TempVars.productsAndPrinters = [];
    promises = OB.UI.printingUtils.productInfoGetter2(newArray);
    return $.when.apply(undefined, promises).then((function() {
      var models, sendToPrinter, templatereceipt;
      models = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assignVar2(models, newArray);
      sendToPrinter = uniquePrinterAndProductGenerator2();
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
      _.each(newArray._wrapped, function(model) {
        model.set('sendstatus', statusMessage);
        return model.trigger('change');
      });
      keyboard.receipt.save();
      OB.UTIL.showSuccess("Orders sent to printers successfully");
      newArray = null;
      return keyboard.receipt.trigger('scan');
    }));
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

  filterAlreadySent = function(lines) {
    var filteredLines;
    return filteredLines = _(lines.models.filter(function(line) {
      return line.attributes.sendstatus === "Not Sent";
    }));
  };

  OB.UI.printingUtils = {
    filterAlreadySent: filterAlreadySent,
    uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator,
    productInfoGetter: productInfoGetter,
    productInfoGetter2: productInfoGetter2,
    assignVar: assignVar,
    assignVar2: assignVar2,
    prepareReceipt: prepareReceipt,
    printGenericLine: printGenericLine,
    buildModel: buildModel,
    getFilteredLines: getFilteredLines,
    printNonGenericLine: printNonGenericLine,
    printLineOrReceipt: printLineOrReceipt,
    buildModel2: buildModel2,
    uniquePrinterAndProductGenerator2: uniquePrinterAndProductGenerator2
  };

}).call(this);
