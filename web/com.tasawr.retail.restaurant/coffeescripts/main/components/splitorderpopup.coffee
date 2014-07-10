enyo.kind
	name: "TSRR.UI.SplitOrderOkButton"
	kind: "OB.UI.ModalDialogButton"
	events:
		onApplyChanges: ""
	tap: ->
		@doHideThisPopup()  if @doApplyChanges()
		return

	initComponents: ->
		@inherited arguments
		@setContent "Ok"


enyo.kind
	kind: "OB.UI.ModalAction"
	name: "TSRR.UI.SplitOrderPopup"
	published:
		orders: null
	handlers:
		onApplyChanges: "applyChanges"
		onChangeEditMode: "changeEditMode"
		onCheckBoxBehaviorForTicketLine: "checkBoxForTicketLines"
	events:
		onShowPopup: ""
		onLineChecked: ""
	i18nHeader: "TSRR_SplitOrderPopupHeader"
	bodyContent:
		kind: "Scroller"
		maxHeight: "225px"
		style: "background-color: #ffffff;"
		components: [
			name: "listOrderLines"
			kind: "TSRR.UI.SplitOrderView"
			args: @args
		]

	bodyButtons:
		components: [
			kind: "TSRR.UI.SplitOrderOkButton"
			name: "okButton"
		,
			kind: "OB.UI.CancelDialogButton"
		]

	init: (model) ->
		me = @
		@model = model

	initComponents: ->
		@inherited arguments

	executeOnShow: ->
		OB.info @args
		@$.bodyContent.$.listOrderLines.setOrders @args.model
		@$.bodyContent.$.listOrderLines.ordersChanged()

	applyChanges: (inSender, inEvent) ->
		console.log 'SplitOrderPopup ok button clicked'
		me = @
		ordersOnPopup = me.model.attributes.orderList
		_.each ordersOnPopup.models, (order) ->
			order.calculateGross()
			order.save()
		@.hide()
		OB.POS.navigate "retail.restaurantmode"


OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
	kind: "TSRR.UI.SplitOrderPopup"
	name: "TSRR_UI_SplitOrderPopup"


enyo.kind
	name: "OB.UI.RenderOrderLineEmpty"
	style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc"
	initComponents: ->
		@inherited arguments