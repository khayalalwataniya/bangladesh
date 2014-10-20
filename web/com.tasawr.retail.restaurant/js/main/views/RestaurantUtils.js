(function() {
  var allPrinters, allProducts, assignVar, deleteBookingById, findProductModel, getBookingInfoByOrder, getCurrentOrder, getOrderLineById, getPendingOrders, printersAndProducts, productInfoGetter, requests, service, uniquePrinterAndProductGenerator;

  printersAndProducts = [];

  allPrinters = [];

  allProducts = [];

  window.productsAndPrinters = [];

  requests = [];

  findProductModel = function(id, callback) {
    var errorCallback, successCallbackProducts;
    OB.Dal.find(OB.Model.Product, {
      id: id
    }, (successCallbackProducts = function(dataProducts) {
      if (dataProducts && dataProducts.length > 0) {
        callback(dataProducts.at(0));
      } else {
        callback(null);
      }
    }), errorCallback = function(tx, error) {
      OB.UTIL.showError("OBDAL error: " + error);
      callback(null);
    });
  };

  deleteBookingById = function(bid, callback) {
    return $.ajax("../../org.openbravo.service.json.jsonrest/TSRR_BookingInfo/" + bid, {
      data: null,
      type: "DELETE",
      processData: false,
      contentType: "application/json",
      success: function(resp) {
        OB.info(resp);
        return callback(resp);
      }
    }, callback(null));
  };

  service = function(source, method, dataparams, callback, callbackError) {
    var ajaxRequest;
    ajaxRequest = new enyo.Ajax({
      url: "/openbravo/org.openbravo.service.json.jsonrest/" + source,
      cacheBust: false,
      method: method,
      handleAs: "json",
      contentType: "application/json;charset=utf-8",
      data: dataparams,
      success: function(inSender, inResponse) {
        var response, status;
        response = inResponse.response;
        status = response.status;
        if (status === 0) {
          callback(response.data);
        } else if (response.errors) {
          callbackError({
            exception: {
              message: response.errors.id
            }
          });
        } else {
          callbackError({
            exception: {
              message: response.error.message
            }
          });
        }
      },
      fail: function(inSender, inResponse) {
        callbackError({
          exception: {
            message: OB.I18N.getLabel("OBPOS_MsgApplicationServerNotAvailable"),
            status: inResponse
          }
        });
      }
    });
    ajaxRequest.go(ajaxRequest.data).response("success").error("fail");
  };

  getCurrentOrder = function(orderId, callback) {
    var criteria;
    criteria = {
      hasbeenpaid: "N",
      session: OB.POS.modelterminal.get("session")
    };
    return OB.Dal.find(OB.Model.Order, criteria, (function(ordersNotPaid) {
      var ord, _i, _len;
      if (ordersNotPaid && ordersNotPaid.length > 0) {
        for (_i = 0, _len = ordersNotPaid.length; _i < _len; _i++) {
          ord = ordersNotPaid[_i];
          if (orderId === ord) {
            OB.info('order found in getCurrentOrder with ID: ' + orderId);
            return callback(ord);
          }
        }
      } else {
        return callback(null);
      }
    }), function() {});
  };

  getBookingInfoByOrder = function(orderId, callback) {
    var criteria;
    criteria = {
      salesOrder: orderId
    };
    return OB.Dal.find(OB.Model.BookingInfo, criteria, (function(bookingsFound) {
      if (bookingsFound && bookingsFound.length > 0) {
        return callback(bookingsFound.at(0));
      } else {
        return callback(null);
      }
    }), function() {});
  };

  getPendingOrders = function(callback) {
    var criteria;
    criteria = {
      hasbeenpaid: "N",
      session: OB.POS.modelterminal.get("session")
    };
    return OB.Dal.find(OB.Model.Order, criteria, (function(ordersNotPaid) {
      if (ordersNotPaid && ordersNotPaid.length > 0) {
        return callback(ordersNotPaid);
      } else {
        return callback(null);
      }
    }), function() {});
  };

  getOrderLineById = function(id, callback) {
    var criteria;
    criteria = {
      id: id,
      session: OB.POS.modelterminal.get("session")
    };
    return OB.Dal.find(OB.Model.OrderLine, criteria, (function(lineItem) {
      if (lineItem && lineItem.length > 0) {
        return callback(lineItem);
      } else {
        return callback(null);
      }
    }), function() {});
  };

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

  OB.UI.RestaurantUtils = {
    getCurrentOrder: getCurrentOrder,
    getPendingOrders: getPendingOrders,
    findProductModel: findProductModel,
    getOrderLineById: getOrderLineById,
    deleteBookingById: deleteBookingById,
    service: service,
    getBookingInfoByOrder: getBookingInfoByOrder,
    uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator,
    productInfoGetter: productInfoGetter,
    assignVar: assignVar
  };

}).call(this);
