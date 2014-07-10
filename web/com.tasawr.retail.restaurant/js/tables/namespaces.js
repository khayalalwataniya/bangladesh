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
      console.log(salesOrder);
      OB.MobileApp.model.hookManager.callbackExecutor(args, callbacks);
    });
    OB.MobileApp.model.hookManager.registerHook("OBPOS_OrderDetailContentHook", function(args, callbacks) {
      var salesOrder;
      console.log("calling... OBPOS_OrderDetailContentHook hook");
      salesOrder = args.order;
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: salesOrder.id
      }, (function(collection) {
        var bi;
        if (collection && collection.length > 0) {
          bi = collection.models[0];
        } else {
          bi = new OB.Model.BookingInfo();
          bi.set('businessPartner', OB.POS.modelterminal.attributes.businessPartner);
          bi.set('salesOrder', salesOrder);
          bi.set('orderidlocal', salesOrder.id);
          bi.set('restaurantTable', TSRR.Tables.Config.currentTable);
          bi.set('ebid', salesOrder.id);
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
    OB.MobileApp.model.hookManager.registerHook("OBPOS_PreSynchData", function() {
      OB.info('calling... OBPOS_PreSynchData');
      OB.info(arguments);
      OB.MobileApp.model.hookManager.callbackExecutor;
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
      currentOrder = {};
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
        TSRR.Tables.Config.currentOrder = currentOrder;
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
