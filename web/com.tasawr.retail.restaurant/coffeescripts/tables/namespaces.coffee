error = undefined
link = undefined
success = undefined
link = document.createElement("link")
link.setAttribute "rel", "stylesheet"
link.setAttribute "type", "text/css"
link.setAttribute "href", "../../web/com.tasawr.retail.restaurant/js/tables/components/WebPOS.Table/Table.WebPOS.css"
document.getElementsByTagName("head")[0].appendChild link
if OB.MobileApp.model.hookManager
  success = (model) ->
    OB.info "DONE"
    return

  error = (tx, error) ->
    OB.error tx
    return

  OB.MobileApp.model.hookManager.registerHook "OBPOS_RenderOrderLine", (args, callbacks) ->
    args.orderline.model.set "sendstatus", "Not Sent"  if args.orderline.model.get("sendstatus") is undefined
    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  OB.MobileApp.model.hookManager.registerHook "OBPOS_PostSyncReceipt", (args, callbacks) ->
    console.log "calling... OBPOS_PostSyncReceipt hook"
    if args.receipt.get("hasbeenpaid") isnt "N"
      OB.Dal.find OB.Model.BookingInfo,
        salesOrder: args.receipt.id
      , ((bookingInfoList) ->
          bi = undefined
          return  unless bookingInfoList.length
          bi = bookingInfoList.models[0]
          OB.Dal.remove bi, success, error
          return
        ), error
    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  OB.MobileApp.model.hookManager.registerHook "OBPOS_OrderDetailContentHook", (args, callbacks) ->
    bi = undefined
    me = undefined
    console.log "calling... OBPOS_OrderDetailContentHook hook"
    me = this
    me.salesOrder = args.order
    return  unless me.salesOrder.has("id")
    bi = undefined
    OB.Dal.find OB.Model.BookingInfo,
      salesOrder: me.salesOrder.get("id")
    , ((bookingInfosFound) ->
        if bookingInfosFound and bookingInfosFound.length > 0
          bi = bookingInfosFound.models[0]
        else
          console.log "no booking found for this order" + me.salesOrder.get("id")
        return
      ), error
    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  OB.MobileApp.model.hookManager.registerHook "OBPOS_PreDeleteCurrentOrder", (args, callbacks) ->
    receipt = undefined
    OB.info "calling... OBPOS_PreDeleteCurrentOrder"
    receipt = args.receipt
    OB.Dal.find OB.Model.BookingInfo,
      salesOrder: receipt.id
    , ((bookingInfoList) ->
        bi = undefined
        if bookingInfoList and bookingInfoList.length > 0
          bi = bookingInfoList.models[0]
          OB.Dal.remove bi, success, error
        return
      ), error
    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

OB.OBPOSPointOfSale.Model.PointOfSale::loadUnpaidOrders = ->
  criteria = undefined
  orderlist = undefined
  orderlist = @get("orderList")
  TSRR.Tables.Config.MyOrderList = orderlist
  criteria =
    hasbeenpaid: "N"
    session: OB.POS.modelterminal.get("session")

  OB.Dal.find OB.Model.Order, criteria, ((ordersNotPaid) ->
    currentOrder = undefined
    loadOrderStr = undefined
    currentOrder = undefined
    loadOrderStr = undefined
    if not ordersNotPaid or ordersNotPaid.length is 0
      orderlist.addFirstOrder()
    else
      orderlist.reset ordersNotPaid.models
      if TSRR.Tables.Config.currentOrderId
        currentOrder = ordersNotPaid.get(TSRR.Tables.Config.currentOrderId)
      else
        currentOrder = ordersNotPaid.models[0]
      orderlist.load currentOrder
      TSRR.Tables.Config.currentOrder = currentOrder  if currentOrder
      TSRR.Tables.Config.currentOrderId = currentOrder.id  if currentOrder
      loadOrderStr = OB.I18N.getLabel("OBPOS_Order") + currentOrder.get("documentNo") + OB.I18N.getLabel("OBPOS_Loaded")  if currentOrder
      OB.UTIL.showAlert.display loadOrderStr, OB.I18N.getLabel("OBPOS_Info")  if loadOrderStr
    return
  ), ->
    OB.UTIL.showError "something went wrong while loading unpaid orders"
    orderlist.addFirstOrder()
    return

  return