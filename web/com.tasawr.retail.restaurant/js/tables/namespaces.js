(function() {
  var error, link, success;

  link = document.createElement('link');

  link.setAttribute('rel', 'stylesheet');

  link.setAttribute('type', 'text/css');

  link.setAttribute('href', '../../web/com.tasawr.retail.restaurant/js/tables/components/WebPOS.Table/Table.WebPOS.css');

  document.getElementsByTagName('head')[0].appendChild(link);

  if (OB.MobileApp.model.hookManager) {
    success = function(model) {
      OB.info('DONE');
    };
    error = function(tx, error) {
      OB.error(tx);
    };
    OB.MobileApp.model.hookManager.registerHook("OBPOS_PostSyncReceipt", function(args, callbacks) {
      console.log("calling... OBPOS_PostSyncReceipt hook");
      if (args.receipt.get('hasbeenpaid') !== 'N') {
        OB.Dal.find(OB.Model.BookingInfo, {
          salesOrder: args.receipt.id
        }, (function(bookingInfoList) {
          var bi;
          if (!bookingInfoList.length) {
            return;
          }
          bi = bookingInfoList.models[0];
          OB.Dal.remove(bi, success, error);
        }), error);
      }
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
    OB.MobileApp.model.hookManager.registerHook("OBPOS_OrderDetailContentHook", function(args, callbacks) {
      var bi, me;
      console.log("calling... OBPOS_OrderDetailContentHook hook");
      me = this;
      me.salesOrder = args.order;
      if (!me.salesOrder.has('id')) {
        return;
      }
      bi = void 0;
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: me.salesOrder.get('id')
      }, (function(bookingInfosFound) {
        if (bookingInfosFound && bookingInfosFound.length > 0) {
          bi = bookingInfosFound.models[0];
        } else {
          console.log('no booking found for this order' + me.salesOrder.get('id'));
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
      }, (function(bookingInfoList) {
        var bi;
        if (bookingInfoList && bookingInfoList.length > 0) {
          bi = bookingInfoList.models[0];
          OB.Dal.remove(bi, success, error);
        }
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
        }
        orderlist.load(currentOrder);
        if (currentOrder) {
          TSRR.Tables.Config.currentOrder = currentOrder;
        }
        if (currentOrder) {
          TSRR.Tables.Config.currentOrderId = currentOrder.id;
        }
        if (currentOrder) {
          loadOrderStr = OB.I18N.getLabel("OBPOS_Order") + currentOrder.get("documentNo") + OB.I18N.getLabel("OBPOS_Loaded");
        }
        if (loadOrderStr) {
          OB.UTIL.showAlert.display(loadOrderStr, OB.I18N.getLabel("OBPOS_Info"));
        }
      }
    }), function() {
      OB.UTIL.showError('something went wrong while loading unpaid orders');
      orderlist.addFirstOrder();
    });
  };

}).call(this);
