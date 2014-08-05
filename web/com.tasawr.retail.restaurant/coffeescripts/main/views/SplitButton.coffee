(->
	splitOrder = undefined
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

	enyo.kind
		name: "OB.OBPOSPointOfSale.UI.LeftToolbarImpl"
		kind: "OB.UI.MultiColumn.Toolbar"
		showMenu: true
		showWindowsMenu: true
		menuEntries: []
		buttons: [
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
		initComponents: ->

			# set up the POS menu
			#Menu entries is used for modularity. cannot be initialized
			#this.menuEntries = [];
			@menuEntries.push kind: "OB.UI.MenuReturn"
			@menuEntries.push kind: "OB.UI.MenuVoidLayaway"
			@menuEntries.push kind: "OB.UI.MenuProperties"
			@menuEntries.push kind: "OB.UI.MenuInvoice"
			@menuEntries.push kind: "OB.UI.MenuPrint"
			@menuEntries.push kind: "OB.UI.MenuLayaway"
			@menuEntries.push kind: "OB.UI.MenuCustomers"
			@menuEntries.push kind: "OB.UI.MenuPaidReceipts"
			@menuEntries.push kind: "OB.UI.MenuQuotations"
			@menuEntries.push kind: "OB.UI.MenuOpenDrawer"

			# TODO: what is this for?!!
			# this.menuEntries = this.menuEntries.concat(this.externalEntries);
			@menuEntries.push
				kind: "OB.UI.MenuSeparator"
				name: "sep1"

			@menuEntries.push kind: "OB.UI.MenuDiscounts"
			@menuEntries.push
				kind: "OB.UI.MenuSeparator"
				name: "sep2"

			@menuEntries.push kind: "OB.UI.MenuReactivateQuotation"
			@menuEntries.push kind: "OB.UI.MenuRejectQuotation"
			@menuEntries.push kind: "OB.UI.MenuCreateOrderFromQuotation"
			@menuEntries.push kind: "OB.UI.MenuQuotation"
			@menuEntries.push kind: "OB.UI.MenuLayaways"
			@menuEntries.push kind: "OB.UI.MenuMultiOrders"
			@menuEntries.push
				kind: "OB.UI.MenuSeparator"
				name: "sep3"

			@menuEntries.push kind: "OB.UI.MenuBackOffice"

			#remove duplicates
			@menuEntries = _.uniq(@menuEntries, false, (p) ->
				p.kind + p.name
			)
			@inherited arguments
			return

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
		console.log model

	OB.Model.modelLoaders.push splitOrder
	return
).call this
