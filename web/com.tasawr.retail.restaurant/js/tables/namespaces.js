(function() {
  var error, link, success;

  link = document.createElement('link');

  link.setAttribute('rel', 'stylesheet');

  link.setAttribute('type', 'text/css');

  link.setAttribute('href', '../../web/com.tasawr.retail.restaurant/js/tables/components/WebPOS.Table/Table.WebPOS.css');

  document.getElementsByTagName('head')[0].appendChild(link);

  if (OB.MobileApp.model.hookManager) {
    success = function(model) {
      console.info(model);
    };
    error = function(tx, error) {
      console.error(tx);
    };
    OB.MobileApp.model.hookManager.registerHook("OBPOS_TerminalLoadedFromBackend", function(args, callbacks) {
      var userId;
      console.log("calling... OBPOS_AddProductToOrder hook");
      userId = OB.POS.modelterminal.usermodel.id;
      $.ajax("../../org.openbravo.service.json.jsonrest/ADUserRoles?_where=userContact='" + userId + "'", {
        data: JSON.stringify(""),
        type: "GET",
        processData: false,
        contentType: "application/json",
        success: function(resp) {
          return _.each(resp.response.data, function(model) {
            if (model.role$_identifier === "CSAdmin") {
              return TSRR.Main.TempVars.admin = true;
            }
          });
        },
        error: function() {
          return console.error('error while completing request');
        }
      });
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
    OB.MobileApp.model.hookManager.registerHook("OBPRINT_PrePrint", function(args, callbacks) {
      var salesOrder;
      console.log("calling... OBPRINT_PrePrint hook");
      salesOrder = this.model.get('order');
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: salesOrder.id
      }, (function(collection) {
        var bi;
        if (!collection.length) {
          return;
        }
        bi = collection.models[0];
        OB.Dal.remove(bi, success, error);
      }), error);
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
    OB.MobileApp.model.hookManager.registerHook("OBRETUR_ReturnFromOrig", function(args, callbacks) {
      var salesOrder;
      console.log("calling... OBRETUR_ReturnFromOrig hook");
      salesOrder = this.model.get('order');
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
    OB.MobileApp.model.hookManager.registerHook("OBPOS_PreAddProductToOrder", function(args, callbacks) {
      var bi, me;
      console.log("calling... OBPOS_PreAddProductToOrder hook");
      me = this;
      me.order = args.receipt;
      bi = void 0;
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: me.order.get('id')
      }, (function(collection) {
        console.info(collection);
        if (collection && collection.length > 0) {
          bi = collection.at(0);
        } else {
          console.log('no booking found for this order');
          bi = new OB.Model.BookingInfo();
          bi.set('businessPartner', OB.POS.modelterminal.attributes.businessPartner);
          bi.set('salesOrder', me.order);
          bi.set('orderidlocal', me.order.get('id'));
          bi.set('restaurantTable', TSRR.Tables.Config.currentTable);
          bi.set('ebid', me.order.get('id'));
          bi.save();
        }
      }), error);
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
    OB.MobileApp.model.hookManager.registerHook("OBPOS_PreDeleteCurrentOrder", function(args, callbacks) {
      var receipt;
      OB.info('calling... OBPOS_PreDeleteCurrentOrder');
      receipt = args.receipt;
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: receipt.id
      }, (function(collection) {
        var bi;
        if (!collection.length) {
          return;
        }
        bi = collection.models[0];
        OB.Dal.remove(bi, success, error);
      }), error);
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
  }

  OB.OBPOSPointOfSale.Model.PointOfSale.prototype.loadUnpaidOrders = function() {
    var criteria, orderlist;
    orderlist = this.get("orderList");
    TSRR.Tables.Config.MyOrderList = orderlist;
    criteria = {
      hasbeenpaid: "N",
      session: OB.POS.modelterminal.get("session")
    };
    OB.Dal.find(OB.Model.Order, criteria, (function(ordersNotPaid) {
      var currentOrder, loadOrderStr;
      currentOrder = void 0;
      loadOrderStr = void 0;
      if (!ordersNotPaid || ordersNotPaid.length === 0) {
        orderlist.addFirstOrder();
      } else {
        orderlist.reset(ordersNotPaid.models);
        if (TSRR.Tables.Config.currentOrderId) {
          currentOrder = ordersNotPaid.get(TSRR.Tables.Config.currentOrderId);
        } else {
          currentOrder = ordersNotPaid.models[0];
          orderlist.load(currentOrder);
          if (currentOrder) {
            TSRR.Tables.Config.currentOrder = currentOrder;
          }
          enyo.Signals.send("onCurrentTableSet", "sms");
          if (currentOrder) {
            loadOrderStr = OB.I18N.getLabel("OBPOS_Order") + currentOrder.get("documentNo") + OB.I18N.getLabel("OBPOS_Loaded");
          }
          if (loadOrderStr) {
            OB.UTIL.showAlert.display(loadOrderStr, OB.I18N.getLabel("OBPOS_Info"));
          }
        }
      }
    }), function() {
      OB.UTIL.showError('something went wrong while loading unpaid orders');
      orderlist.addFirstOrder();
    });
  };

}).call(this);
