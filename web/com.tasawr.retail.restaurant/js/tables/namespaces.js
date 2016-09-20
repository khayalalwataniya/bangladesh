(function() {
  var error, link, success;

  error = void 0;

  link = void 0;

  success = void 0;

  link = document.createElement("link");

  link.setAttribute("rel", "stylesheet");

  link.setAttribute("type", "text/css");

  link.setAttribute("href", "../../web/com.tasawr.retail.restaurant/js/tables/components/WebPOS.Table/Table.WebPOS.css");

  document.getElementsByTagName("head")[0].appendChild(link);

 var isnew = 0;
 
  if (OB.UTIL.HookManager) {
    success = function(model) {
      OB.info("DONE");
     OB.POS.navigate('retail.restaurantmode');
    };
    error = function(tx, error) {
      OB.error(tx);
    };
  //}/* bykazi*/
  //my
  /*OB.UTIL.HookManager.registerHook("OBPOS_RenderOrderLine", function(args, callbacks) {
      if (args.orderline.model.get("sendstatus") === void 0) {
        args.orderline.model.set("sendstatus", "Not Sent");
      }
      OB.UTIL.HookManager.callbackExecutor(args, callbacks);
    });*/
  //my
    
    OB.UTIL.HookManager.registerHook("OBPOS_RenderOrderLine", function(args, callbacks) {
            //bykazi
     if (OB.POS.modelterminal.orderList.current.get('orderType') === 0) {
      console.log("OB.POS.modelterminal.orderList.current.get('orderType')" + OB.POS.modelterminal.orderList.current.get('orderType'));
        args.orderline.model.set("sendstatus", "sent");
      }
      //bykazi // (args.orderline.model.get("sendstatus") === void 0) 
      else if (args.orderline.model.get("sendstatus") === void 0) {
        if (args.orderline.model.get("sendstatus") !== "sent") {
        args.orderline.model.set("sendstatus", "Not Sent");
      }
      }

      OB.UTIL.HookManager.callbackExecutor(args, callbacks);
    });
    
    OB.UTIL.HookManager.registerHook("OBPOS_PostSyncReceipt", function(args, callbacks) {
      console.log("calling... OBPOS_PostSyncReceipt hook");
      if (args.receipt.get("hasbeenpaid") !== "N") {
        OB.Dal.find(OB.Model.BookingInfo, {
          salesOrder: args.receipt.id
        }, (function(bookingInfoList) {
          var bi;
          bi = void 0;
          if (!bookingInfoList.length) {
            return;
          }
          bi = bookingInfoList.models[0];
          OB.Dal.remove(bi, success, error);
        }), error);
      }
      OB.UTIL.HookManager.callbackExecutor(args, callbacks);
    });
    OB.UTIL.HookManager.registerHook("OBPOS_OrderDetailContentHook", function(args, callbacks) {
      var bi, me;
      bi = void 0;
      me = void 0;
      console.log("calling... OBPOS_OrderDetailContentHook hook");
      me = this;
      me.salesOrder = args.order;
      if (!me.salesOrder.has("id")) {
        return;
      }
      bi = void 0;
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: me.salesOrder.get("id")
      }, (function(bookingInfosFound) {
        if (bookingInfosFound && bookingInfosFound.length > 0) {
          bi = bookingInfosFound.models[0];
        } else {
      if (OB.POS.modelterminal.orderList.current.get('orderType') === 2) {
        if (isnew === 0){
          OB.POS.modelterminal.orderList.addNewOrder();
          isnew = isnew + 1;
        }
           }
          console.log("no booking found for this order" + me.salesOrder.get("id"));
        }
      }), error);
      OB.UTIL.HookManager.callbackExecutor(args, callbacks);
    });
    OB.UTIL.HookManager.registerHook("OBPOS_PreDeleteCurrentOrder", function(args, callbacks) {
      var receipt;
      receipt = void 0;
      OB.info("calling... OBPOS_PreDeleteCurrentOrder");
      receipt = args.receipt;
      OB.Dal.find(OB.Model.BookingInfo, {
        salesOrder: receipt.id
      }, (function(bookingInfoList) {
        var bi;
        bi = void 0;
        if (bookingInfoList && bookingInfoList.length > 0) {
          bi = bookingInfoList.models[0];
          OB.Dal.remove(bi, success, error);
        }
      }), error);
      OB.UTIL.HookManager.callbackExecutor(args, callbacks);
    });
  }//my
/*
  OB.OBPOSPointOfSale.Model.PointOfSale.prototype.loadUnpaidOrders = function() {
    var criteria, orderlist;
    criteria = void 0;
    orderlist = void 0;
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
      OB.UTIL.showError("something went wrong while loading unpaid orders");
      orderlist.addFirstOrder();
    });
  };*/

}).call(this);
