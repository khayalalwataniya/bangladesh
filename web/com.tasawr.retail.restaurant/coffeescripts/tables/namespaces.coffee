#!/usr/bin/env coffee
#-*- coding:UTF-8 -*-

# Load the CSS dynamically
link = document.createElement 'link'
link.setAttribute 'rel', 'stylesheet'
link.setAttribute 'type', 'text/css'
link.setAttribute 'href', '../../web/com.tasawr.retail.restaurant/js/tables/components/WebPOS.Table/Table.WebPOS.css'
document.getElementsByTagName('head')[0].appendChild link

if OB.MobileApp.model.hookManager
  success = (model) ->
    console.info model
    return
  error = (tx, error) ->
    console.error tx
    return

  # delete related booking info once order has been paid
  OB.MobileApp.model.hookManager.registerHook "OBPRINT_PrePrint", (args, callbacks) ->
    console.log "calling... OBPRINT_PrePrint hook"
    salesOrder = @.model.get 'order'
    OB.Dal.find OB.Model.BookingInfo,
      salesOrder: salesOrder.id
    , ((collection) -> # inline callback
        return  unless collection.length # no record found
        bi = collection.models[0]
        OB.Dal.remove bi, success, error
        return
      ), error
    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  # delete related booking info once order has been paid
  OB.MobileApp.model.hookManager.registerHook "OBRETUR_ReturnFromOrig", (args, callbacks) ->
    console.log "calling... OBRETUR_ReturnFromOrig hook"
    salesOrder = @.model.get 'order'
    console.log salesOrder
    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  OB.MobileApp.model.hookManager.registerHook "OBPOS_OrderDetailContentHook", (args, callbacks) ->
    console.log "calling... OBPOS_OrderDetailContentHook hook"
    salesOrder = args.order
    OB.Dal.find OB.Model.BookingInfo,
      salesOrder: salesOrder.id
    , ((collection) -> # inline callback
        if collection and collection.length > 0
          bi = collection.models[0]
        else
          bi = new OB.Model.BookingInfo()
          bi.set 'businessPartner', OB.POS.modelterminal.attributes.businessPartner
          bi.set 'salesOrder', salesOrder
          bi.set 'orderidlocal', salesOrder.id
          bi.set 'restaurantTable', TSRR.Tables.Config.currentTable
          bi.set 'ebid', salesOrder.id
          bi.save()
        return
      ), error

    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  # delete related booking info when order has been deleted
  OB.MobileApp.model.hookManager.registerHook "OBPOS_PreDeleteCurrentOrder", (args, callbacks) ->
    OB.info 'calling... OBPOS_PreDeleteCurrentOrder'
    receipt = args.receipt
    OB.Dal.find OB.Model.BookingInfo,
      salesOrder: receipt.id
    , ((collection) -> # inline callback
        return  unless collection.length # no record found
        bi = collection.models[0]
        OB.Dal.remove bi, success, error
        return
      ), error

    OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
    return

  OB.MobileApp.model.hookManager.registerHook "OBPOS_PreSynchData", () ->
    OB.info 'calling... OBPOS_PreSynchData'
    OB.info arguments
    OB.MobileApp.model.hookManager.callbackExecutor
    return

OB.OBPOSPointOfSale.Model.PointOfSale::loadUnpaidOrders = ->
  orderlist = @get("orderList")
  TSRR.Tables.Config.MyOrderList = orderlist
  criteria =
    hasbeenpaid: "N"
    session: OB.POS.modelterminal.get("session")
  OB.Dal.find OB.Model.Order, criteria, ((ordersNotPaid) -> #OB.Dal.find success
    currentOrder = {}
    loadOrderStr = undefined
    if not ordersNotPaid or ordersNotPaid.length is 0

      # If there are no pending orders,
      #  add an initial empty order
      orderlist.addFirstOrder()
    else

      # The order object is stored in the json property of the row fetched from the database
      orderlist.reset ordersNotPaid.models
      if TSRR.Tables.Config.currentOrderId
        currentOrder = ordersNotPaid.get TSRR.Tables.Config.currentOrderId
      else
        currentOrder = ordersNotPaid.models[0]
      orderlist.load currentOrder
      TSRR.Tables.Config.currentOrder = currentOrder
      loadOrderStr = OB.I18N.getLabel("OBPOS_Order") + currentOrder.get("documentNo") + OB.I18N.getLabel("OBPOS_Loaded") if currentOrder
      OB.UTIL.showAlert.display loadOrderStr, OB.I18N.getLabel("OBPOS_Info") if loadOrderStr
    return
  ), -> #OB.Dal.find error
    # If there is an error fetching the pending orders,
    # add an initial empty order
    OB.UTIL.showError 'something went wrong while loading unpaid orders'
    orderlist.addFirstOrder()
    return

  return
