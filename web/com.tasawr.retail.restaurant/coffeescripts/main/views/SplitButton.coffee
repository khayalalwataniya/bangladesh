enyo.kind
	name: "TSRR.Main.UI.ApplyDialogButton"
	kind: "OB.UI.ModalDialogButton"
	isDefaultAction: true
	events:
		onHideThisPopup: ""
		onAcceptButton: ""
	disabled: false
	putDisabled: (state) ->
		if state is false
			@setDisabled false
			@removeClass "disabled"
			@setAttribute "disabled", null
			@disabled = false
		else
			@setDisabled()
			@addClass "disabled"
			@setAttribute "disabled", "disabled"
			@disabled = true

	tap: ->
		return  if @disabled
		@doAcceptButton()

	initComponents: ->
		@inherited arguments
		@setContent OB.I18N.getLabel("OBMOBC_LblApply")

enyo.kind
	name: "TSRR.Main.UI.DetailsDialogButton"
	kind: "OB.UI.ModalDialogButton"
	style: "color: white; background-color: orange;"
	isDefaultAction: true
	events:
		onHideThisPopup: ""
		onDetailsButton: ""

	tap: ->
		@doDetailsButton()

	initComponents: ->
		@inherited arguments
		@setContent OB.I18N.getLabel("TSRR_LblDetails")

enyo.kind
	name: "TSRR.Main.UI.RestaurantHomeButton"
	kind: "OB.UI.ToolbarButton"
	i18nLabel: "TSRR_LblRestaurants"
	tap: ->
		OB.POS.navigate "retail.restaurantmode"

	initComponents: ->
		@inherited arguments


OB.OBPOSPointOfSale.UI.LeftToolbarImpl::buttons = [
	{
		kind: "TSRR.Main.UI.RestaurantHomeButton"
		span: 4
	}
	{
		kind: "OB.UI.ButtonNew"
		span: 2
	}
	{
		kind: "OB.UI.ButtonDelete"
		span: 2
	}
	{
		kind: "OB.OBPOSPointOfSale.UI.ButtonTabPayment"
		name: "payment"
		span: 4
	}
]

OB.OBPOSPointOfSale.UI.ToolbarPayment::sideButtons.push
	command: "SplitOrder"
	i18nLabel: "TSRR_BtnSplitOrder"
	permission: "com.tasawr.retail.restaurant.SplitOrder"
	stateless: true
	action: (keyboard, txt) ->
		amount = undefined
		amount = OB.DEC.number(OB.I18N.parseNumber(txt or ""))
		amount = ((if _.isNaN(amount) then keyboard.receipt.getPending() else amount))
		keyboard.doShowPopup
			popup: "TSRR_UI_ModalReceiptsSplit"
			args:
				keyboard: keyboard
				header: OB.I18N.getLabel("TSRR_RestaurantSearchDialogHeaderMessage", [OB.I18N.formatCurrency(amount)])
				amount: amount
				model: keyboard.receipt
				receiptsInfo: keyboard.receipt
				action: (dialog) ->


splitOrder = (model) ->
	#console.log model

OB.Model.modelLoaders.push splitOrder
