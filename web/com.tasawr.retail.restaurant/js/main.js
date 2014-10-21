(function() {
  window.TSRR = window.TSRR || {};

  TSRR.Main = TSRR.Main || {};

  TSRR.Main.Extra = TSRR.Main.Extra || {};

  TSRR.Main.Model = TSRR.Main.Model || {};

  TSRR.Main.Collection = TSRR.Main.Collection || {};

  TSRR.Main.UI = TSRR.Main.UI || {};

  TSRR.Main.order1 = TSRR.Main.order1 || {};

  TSRR.Main.order2 = TSRR.Main.order2 || {};

  TSRR.Tables = TSRR.Tables || {};

  TSRR.Tables.Model = TSRR.Tables.Model || {};

  TSRR.Tables.Collection = TSRR.Tables.Collection || {};

  TSRR.Tables.UI = TSRR.Tables.UI || {};

  TSRR.Tables.UI.Tables = TSRR.Tables.UI.Tables || {};

  TSRR.Tables.Config = TSRR.Tables.Config || {};

  /*
  enyo.kind
  	name: "OB.OBPOSPointOfSale.UI.KeyboardOrder"
  	kind: "OB.UI.Keyboard"
  	keypads: []
  	published:
  		receipt: null
  
  	events:
  		onShowPopup: ""
  		onAddProduct: ""
  		onSetDiscountQty: ""
  		onDiscountsMode: ""
  
  	discountsMode: false
  	handlers:
  		onKeyboardOnDiscountsMode: "keyboardOnDiscountsMode"
  
  	keyboardOnDiscountsMode: (inSender, inEvent) ->
  		if inEvent.status
  			@showSidepad "ticketDiscountsToolbar"
  		else
  			@showSidepad "sideenabled"
  		unless inEvent.status
  
  			#exit from discounts
  			@discountsMode = false
  			@defaultcommand = @prevdefaultcommand  if @prevdefaultcommand
  			@buttons["ticket:discount"].removeClass "btnactive"  if @buttons["ticket:discount"]
  			@keyboardDisabled inSender,
  				status: false
  
  		else
  			@discountsMode = true
  			@prevdefaultcommand = @defaultcommand
  			@defaultcommand = "ticket:discount"
  			if inEvent.writable
  
  				#enable keyboard
  				@keyboardDisabled inSender,
  					status: false
  
  
  				#button as active
  				@buttons["ticket:discount"].addClass "btnactive"  if @buttons["ticket:discount"]
  			else
  				@buttons["ticket:discount"].removeClass "btnactive"  if @buttons["ticket:discount"]
  				@keyboardDisabled inSender,
  					status: true
  
  				true
  		return
  
  	sideBarEnabled: true
  	receiptChanged: ->
  		@$.toolbarcontainer.$.toolbarPayment.setReceipt @receipt
  		@line = null
  		@receipt.get("lines").on "selected", ((line) ->
  			@line = line
  			@clearInput()
  			return
  		), this
  		return
  
  	initComponents: ->
  		me = this
  		actionAddProduct = (keyboard, value) ->
  			if keyboard.receipt.get("isEditable") is false
  				me.doShowPopup popup: "modalNotEditableOrder"
  				return true
  			if keyboard.line and keyboard.line.get("product").get("isEditableQty") is false
  				me.doShowPopup popup: "modalNotEditableLine"
  				return true
  			if keyboard.line
  				if (_.isNaN(value) or value > 0) and keyboard.line.get("product").get("groupProduct") is false
  					me.doShowPopup popup: "modalProductCannotBeGroup"
  					return true
  				me.doAddProduct
  					product: keyboard.line.get("product")
  					qty: value
  					options:
  						line: keyboard.line
  
  				keyboard.receipt.trigger "scan"
  			return
  
  		actionRemoveProduct = (keyboard, value) ->
  			if keyboard.receipt.get("isEditable") is false
  				me.doShowPopup popup: "modalNotEditableOrder"
  				return true
  			if keyboard.line and keyboard.line.get("product").get("isEditableQty") is false
  				me.doShowPopup popup: "modalNotEditableLine"
  				return true
  			if keyboard.line
  				keyboard.receipt.removeUnit keyboard.line, value
  				keyboard.receipt.trigger "scan"
  			return
  
  
  		# action bindable to a command that completely deletes a product from the order list
  		actionDeleteLine = (keyboard) ->
  			if keyboard.receipt.get("isEditable") is false
  				me.doShowPopup popup: "modalNotEditableOrder"
  				return true
  			if keyboard.line and keyboard.line.get("product").get("isEditableQty") is false
  				me.doShowPopup popup: "modalNotEditableLine"
  				return true
  			if keyboard.line
  				keyboard.receipt.deleteLine keyboard.line
  				keyboard.receipt.trigger "scan"
  			return
  
  		@addCommand "line:qty",
  			action: (keyboard, txt) ->
  				value = OB.I18N.parseNumber(txt)
  				toadd = undefined
  				return true  unless keyboard.line
  				if value or value is 0
  					toadd = value - keyboard.line.get("qty")
  					# If nothing to add then return
  					return  if toadd is 0
  					if value is 0 # If final quantity will be 0 then request approval
  						OB.UTIL.Approval.requestApproval me.model, "OBPOS_approval.deleteLine", (approved, supervisor, approvalType) ->
  							actionAddProduct keyboard, toadd  if approved
  							return
  
  					else
  						actionAddProduct keyboard, toadd
  				return
  
  		@addCommand "line:price",
  			permission: "OBPOS_order.changePrice"
  			action: (keyboard, txt) ->
  				if keyboard.receipt.get("isEditable") is false
  					me.doShowPopup popup: "modalNotEditableOrder"
  					return true
  				return true  unless keyboard.line
  				if keyboard.line.get("product").get("isEditablePrice") is false
  					me.doShowPopup popup: "modalNotEditableLine"
  					return true
  				if keyboard.line
  					OB.UTIL.Approval.requestApproval me.model, "OBPOS_approval.setPrice", (approved, supervisor, approvalType) ->
  						if approved
  							keyboard.receipt.setPrice keyboard.line, OB.I18N.parseNumber(txt)
  							keyboard.receipt.trigger "scan"
  						return
  
  				return
  
  		@addCommand "line:dto",
  			permission: "OBPOS_order.discount"
  			action: (keyboard, txt) ->
  				if keyboard.receipt.get("isEditable") is false
  					me.doShowPopup popup: "modalNotEditableOrder"
  					return true
  				if OB.MobileApp.model.get("permissions")["OBPOS_retail.discountkeyboard"] is true or keyboard.line.getQty() < 0
  					OB.UTIL.showWarning OB.I18N.getLabel("OBMOBC_LineCanNotBeSelected")
  					return true
  				keyboard.receipt.trigger "discount", keyboard.line, OB.I18N.parseNumber(txt)  if keyboard.line
  				return
  
  		@addCommand "screen:dto",
  			stateless: true
  			permission: "OBPOS_order.discount"
  			action: (keyboard, txt) ->
  				me.doDiscountsMode
  					tabPanel: "edit"
  					keyboard: "toolbardiscounts"
  					edit: false
  					options:
  						discounts: true
  
  				return
  
  
  		#To be used in the discounts side bar
  		@addCommand "ticket:discount",
  			permission: "OBPOS_retail.advDiscounts"
  			action: (keyboard, txt) ->
  				if keyboard.discountsMode
  					me.doSetDiscountQty qty: OB.I18N.parseNumber(txt)
  					true
  
  		@addCommand "code", new OB.UI.BarcodeActionHandler()
  		@addCommand "+",
  			stateless: true
  			action: (keyboard, txt) ->
  				qty = 1
  				qty = OB.I18N.parseNumber(txt)  if (not _.isNull(txt) or not _.isUndefined(txt)) and not _.isNaN(OB.I18N.parseNumber(txt))
  				actionAddProduct keyboard, qty
  				return
  
  		@addCommand "-",
  			stateless: true
  			action: (keyboard, txt) ->
  				qty = 1
  				value = undefined
  				qty = OB.I18N.parseNumber(txt)  if (not _.isNull(txt) or not _.isUndefined(txt)) and not _.isNaN(OB.I18N.parseNumber(txt))
  				value = keyboard.line.get("qty") - qty  unless _.isUndefined(keyboard.line)
  				if value is 0 # If final quantity will be 0 then request approval
  					OB.UTIL.Approval.requestApproval me.model, "OBPOS_approval.deleteLine", (approved, supervisor, approvalType) ->
  						actionAddProduct keyboard, -qty  if approved
  						return
  
  				else
  					actionAddProduct keyboard, -qty
  				return
  
  
  		# add a command that will handle the DELETE keyboard key
  		@addCommand "line:delete",
  			stateless: true
  			action: (keyboard) ->
  				OB.UTIL.Approval.requestApproval me.model, "OBPOS_approval.deleteLine", (approved, supervisor, approvalType) ->
  					actionDeleteLine keyboard  if approved
  					return
  
  				return
  
  
  		# calling super after setting keyboard properties
  		@inherited arguments_
  		@addToolbarComponent "OB.OBPOSPointOfSale.UI.ToolbarPayment"
  		@addToolbar OB.OBPOSPointOfSale.UI.ToolbarScan
  		@addToolbar OB.OBPOSPointOfSale.UI.ToolbarDiscounts
  		return
  
  	init: (model) ->
  		@model = model
  
  		# Add the keypads for each payment method
  		@initCurrencyKeypads()
  		_.each @keypads, ((keypadname) ->
  			@addKeypad keypadname
  			return
  		), this
  		return
  
  	initCurrencyKeypads: ->
  		me = this
  		currenciesManaged = {}
  		_.each OB.POS.modelterminal.get("payments"), ((payment) ->
  
  			# Is cash method if is checked as iscash or is the legacy hardcoded cash method for euros.
  			if (payment.paymentMethod.iscash and payment.paymentMethod.showkeypad) and not currenciesManaged[payment.paymentMethod.currency]
  
  				# register that is already built
  				currenciesManaged[payment.paymentMethod.currency] = true
  
  				# Build the panel
  				OB.Dal.find OB.Model.CurrencyPanel,
  					currency: payment.paymentMethod.currency
  				, ((datacurrency) ->
  						if datacurrency.length > 0
  							me.buildCoinsAndNotesPanel payment, payment.symbol, datacurrency
  
  							# Add the legacy keypad if is the legacy hardcoded cash method for euros.
  						else me.addKeypad "OB.UI.KeypadCoinsLegacy"  if payment.payment.searchKey is "OBPOS_payment.cash" and payment.paymentMethod.currency is "102"
  						return
  					), (tx, error) ->
  					OB.UTIL.showError "OBDAL error: " + error
  					return
  
  			return
  		), this
  		return
  
  	buildCoinsAndNotesButton: (paymentkey, coin) ->
  		if coin
  			kind: "OB.UI.PaymentButton"
  			paymenttype: paymentkey
  			amount: coin.get("amount")
  			background: coin.get("backcolor") or "#f3bc9e"
  			bordercolor: coin.get("bordercolor") or coin.get("backcolor") or "#f3bc9e"
  		else
  			kind: "OB.UI.ButtonKey"
  			classButton: "btnkeyboard-num"
  			label: ""
  			command: "dummy"
  
  	buildCoinsAndNotesPanel: (payment, symbol, datacurrency) ->
  		enyo.kind
  			name: "OB.UI.Keypad" + payment.payment.searchKey
  			label: _.template("<%= symbol %>,<%= symbol %>,<%= symbol %>,...",
  				symbol: symbol
  			)
  			padName: "Coins-" + payment.paymentMethod.currency
  			padPayment: payment.payment.searchKey
  			components: [
  				{
  					classes: "row-fluid"
  					components: [
  						{
  							classes: "span4"
  							components: [
  								kind: "OB.UI.ButtonKey"
  								classButton: "btnkeyboard-num"
  								label: "/"
  								command: "/"
  							]
  						}
  						{
  							classes: "span4"
  							components: [
  								kind: "OB.UI.ButtonKey"
  								classButton: "btnkeyboard-num"
  								label: "*"
  								command: "*"
  							]
  						}
  						{
  							classes: "span4"
  							components: [
  								kind: "OB.UI.ButtonKey"
  								classButton: "btnkeyboard-num"
  								label: "%"
  								command: "%"
  							]
  						}
  					]
  				}
  				{
  					classes: "row-fluid"
  					components: [
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(9))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(10))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(11))]
  						}
  					]
  				}
  				{
  					classes: "row-fluid"
  					components: [
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(6))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(7))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(8))]
  						}
  					]
  				}
  				{
  					classes: "row-fluid"
  					components: [
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(3))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(4))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(5))]
  						}
  					]
  				}
  				{
  					classes: "row-fluid"
  					components: [
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(0))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(1))]
  						}
  						{
  							classes: "span4"
  							components: [@buildCoinsAndNotesButton(payment.payment.searchKey, datacurrency.at(2))]
  						}
  					]
  				}
  			]
  
  		@addKeypad "OB.UI.Keypad" + payment.payment.searchKey
  		return
  
  enyo.kind
  
  # Overwrite this component to customize the BarcodeActionHandler
  	name: "OB.UI.BarcodeActionHandler"
  	kind: "OB.UI.AbstractBarcodeActionHandler"
  	addWhereFilter: (txt) ->
  		"where product.upc = '" + txt + "'"
  
  	findProductByBarcode: (txt, callback) ->
  		errorCallback = (tx, error) ->
  			OB.UTIL.showError "OBDAL error: " + error
  			return
  		successCallbackProducts = (dataProducts) ->
  			if dataProducts and dataProducts.length > 0
  				OB.debug "productfound"
  				callback new Backbone.Model(dataProducts.at(0))
  			else
  
  				# 'UPC/EAN code not found'
  				OB.UTIL.showWarning OB.I18N.getLabel("OBPOS_KbUPCEANCodeNotFound", [txt])
  			return
  		criteria = undefined
  		OB.debug "BarcodeActionHandler - id: " + txt
  		OB.Dal.query OB.Model.Product, "select * from m_product as product " + @addWhereFilter(txt), null, successCallbackProducts, errorCallback, this
  		return
  
  	addProductToReceipt: (keyboard, product) ->
  		keyboard.doAddProduct product: product
  		keyboard.receipt.trigger "scan"
  		return
  
  enyo.kind
  
  # Overwrite this component to customize the BarcodeActionHandler
  	name: "OB.UI.BarcodeActionHandler"
  	kind: "OB.UI.AbstractBarcodeActionHandler"
  	addWhereFilter: (txt) ->
  		"where product.upc = '" + txt + "'"
  
  	findProductByBarcode: (txt, callback) ->
  		errorCallback = (tx, error) ->
  			OB.UTIL.showError "OBDAL error: " + error
  			return
  		successCallbackProducts = (dataProducts) ->
  			if dataProducts and dataProducts.length > 0
  				OB.debug "productfound"
  				callback new Backbone.Model(dataProducts.at(0))
  			else
  
  				# 'UPC/EAN code not found'
  				OB.UTIL.showWarning OB.I18N.getLabel("OBPOS_KbUPCEANCodeNotFound", [txt])
  			return
  		criteria = undefined
  		OB.debug "BarcodeActionHandler - id: " + txt
  		OB.Dal.query OB.Model.Product, "select * from m_product as product " + @addWhereFilter(txt), null, successCallbackProducts, errorCallback, this
  		return
  
  	addProductToReceipt: (keyboard, product) ->
  		keyboard.doAddProduct product: product
  		keyboard.receipt.trigger "scan"
  		return
  */


}).call(this);
