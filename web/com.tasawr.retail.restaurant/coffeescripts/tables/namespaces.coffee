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
		OB.info 'DONE'
		return
	error = (tx, error) ->
		OB.error tx
		return


	# delete related booking info once order has been paid
	OB.MobileApp.model.hookManager.registerHook "OBPOS_PostSyncReceipt", (args, callbacks) ->
		console.log "calling... OBPOS_PostSyncReceipt hook"
		unless args.receipt.get('hasbeenpaid') is 'N'
			OB.Dal.find OB.Model.BookingInfo,
				salesOrder: args.receipt.id
			, ((bookingInfoList) -> # inline callback
					return  unless bookingInfoList.length # no record found
					bi = bookingInfoList.models[0]
					OB.Dal.remove bi, success, error
					return
				), error


		OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
		return


	OB.MobileApp.model.hookManager.registerHook "OBPOS_OrderDetailContentHook", (args, callbacks) ->
		console.log "calling... OBPOS_OrderDetailContentHook hook"
		me = @
		me.salesOrder = args.order
		return unless me.salesOrder.has('id')
		bi = undefined
		OB.Dal.find OB.Model.BookingInfo,
			salesOrder: me.salesOrder.get('id')
		, ((bookingInfosFound) -> # inline callback
				if bookingInfosFound and bookingInfosFound.length > 0
					bi = bookingInfosFound.models[0]
				else
					console.log 'no booking found for this order' + me.salesOrder.get('id')

#					if salesOrder
#						bi = new OB.Model.BookingInfo()
#						bi.set 'businessPartner', OB.POS.modelterminal.attributes.businessPartner
#						bi.set 'salesOrder', salesOrder
#						bi.set 'orderidlocal', salesOrder.get('id')
#						bi.set 'restaurantTable', JSON.parse(localStorage.getItem('currentTable'))
#						bi.set 'ebid', salesOrder.get('id')
#						bi.set 'locked', false
#						bi.set 'totalAmount', salesOrder.getGross()
#						bi.save()
#						localStorage.setItem('currentBookingInfo', JSON.stringify(bi))
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
		, ((bookingInfoList) -> # inline callback
				if bookingInfoList and bookingInfoList.length > 0
					bi = bookingInfoList.models[0]
					OB.Dal.remove bi, success, error
				return
			), error

		OB.MobileApp.model.hookManager.callbackExecutor args, callbacks
		return


OB.OBPOSPointOfSale.Model.PointOfSale::loadUnpaidOrders = ->
	orderlist = @get("orderList")
	TSRR.Tables.Config.MyOrderList = orderlist
	criteria =
		hasbeenpaid: "N"
		session: OB.POS.modelterminal.get("session")
	OB.Dal.find OB.Model.Order, criteria, ((ordersNotPaid) -> #OB.Dal.find success
		currentOrder = undefined
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
			TSRR.Tables.Config.currentOrder = currentOrder if currentOrder
			TSRR.Tables.Config.currentOrderId = currentOrder.id if currentOrder

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