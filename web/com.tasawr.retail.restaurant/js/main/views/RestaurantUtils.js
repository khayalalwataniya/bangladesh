(function() {
  var deleteBookingById, findProductModel, getBookingInfoByOrder, getCurrentOrder, getOrderLineById, getPendingOrders, service;

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
    }), function() {
      return console.log(arguments);
    });
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
    }), function() {
      return console.log(arguments);
    });
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
    }), function() {
      return console.log(arguments);
    });
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
    }), function() {
      return console.log(arguments);
    });
  };

  OB.UI.RestaurantUtils = {
    getCurrentOrder: getCurrentOrder,
    getPendingOrders: getPendingOrders,
    findProductModel: findProductModel,
    getOrderLineById: getOrderLineById,
    deleteBookingById: deleteBookingById,
    service: service,
    getBookingInfoByOrder: getBookingInfoByOrder
  };

  enyo.kind({
    name: "OB.UI.OrderHeader",
    classes: "row-fluid",
    published: {
      order: null
    },
    style: "font-size: 95%; background-color: #ffffff; border-bottom: 1px solid #cccccc;",
    components: [
      {
        classes: "row-fluid",
        components: [
          {
            style: "font-size: 95%; background-color: #ffffff; border-bottom: 1px solid #cccccc;",
            components: [
              {
                kind: "TSRR.Main.UI.LineLabel",
                content: "Aktueller Benutzer:"
              }, {
                kind: "TSRR.Main.UI.TSRR.MainQuickLogout",
                name: "qlobutton",
                style: "font-size: 90%; float: right;"
              }, {
                kind: "TSRR.Main.UI.TSRR.MainQuickLock",
                name: "qlbutton",
                style: "font-size: 90%; float: right;"
              }, {
                style: "font-size: 90%; clear:both;"
              }
            ]
          }
        ]
      }, {
        classes: "row-fluid",
        components: [
          {
            style: "font-size: 95%; background-color: #ffffff; border-bottom: 1px solid #cccccc;",
            components: [
              {
                kind: "TSRR.Main.UI.LineLabel",
                content: "Aktueller Verkäufer:"
              }, {
                kind: "TSRR.Main.UI.TSRR.MainSalesRepresentative",
                name: "srbutton",
                style: "font-size: 90%; float: right;"
              }, {
                style: "font-size: 90%; clear:both;"
              }
            ]
          }
        ]
      }, {
        classes: "row-fluid",
        components: [
          {
            style: "font-size: 95%; background-color: #ffffff; border-bottom: 1px solid #cccccc;",
            components: [
              {
                kind: "TSRR.Main.UI.LineLabel",
                content: "Aktueller Kunde:"
              }, {
                kind: "TSRR.Main.UI.TSRR.MainBusinessPartner",
                name: "bpbutton",
                style: "font-size: 90%; float: right;"
              }, {
                kind: "TSRR.Main.UI.LineLabel",
                name: "lblfidelity",
                content: "10 Sterne"
              }, {
                style: "clear:both;"
              }
            ]
          }
        ]
      }
    ],
    orderChanged: function(oldValue) {
      this.$.bpbutton.setOrder(this.order);
      this.$.srbutton.setOrder(this.order);
      this.$.qlbutton.setOrder(this.order);
      this.$.qlobutton.setOrder(this.order);
    }
  });

}).call(this);
