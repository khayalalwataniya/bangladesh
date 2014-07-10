#
# ************************************************************************************
# * Copyright (C) 2012-2013 Openbravo S.L.U.
# * Licensed under the Openbravo Commercial License version 1.0
# * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
# * or in the legal folder of this module distribution.
# ************************************************************************************
#

#global enyo, _

enyo.kind
	name: "OB.OBPOSPointOfSale.UI.LineProperty"
	components: [
		classes: "row-fluid"
		style: "clear: both;"
		components: [
			{
				classes: "span4"
				name: "propertyLabel"
			}
			{
				classes: "span8"
				components: [
					tag: "span"
					name: "propertyValue"
				]
			}
		]
	]
	render: (model) ->
		if model
			@$.propertyValue.setContent model.get(@propertyToPrint)
		else
			@$.propertyValue.setContent ""
		return

	initComponents: ->
		@inherited arguments
		@$.propertyLabel.setContent OB.I18N.getLabel(@I18NLabel)
		return

enyo.kind
	name: "OB.OBPOSPointOfSale.UI.LinePropertyDiv"
	components: [
		classes: "row-fluid"
		style: "clear: both;"
		components: [
			{
				classes: "span4"
				name: "propertyLabel"
			}
			{
				classes: "span8"
				components: [
					tag: "div"
					name: "propertyValue"
				]
			}
		]
	]
	render: (model) ->
		if model
			@$.propertyValue.setContent model.get(@propertyToPrint)
		else
			@$.propertyValue.setContent ""
		return

	initComponents: ->
		@inherited arguments
		@$.propertyLabel.setContent OB.I18N.getLabel(@I18NLabel)
		return

enyo.kind
	name: "OB.OBPOSPointOfSale.UI.EditLine"
	propertiesToShow: [
		{
			kind: "OB.OBPOSPointOfSale.UI.LineProperty"
			position: 10
			name: "descLine"
			I18NLabel: "OBPOS_LineDescription"
			render: (line) ->
				if line
					@$.propertyValue.setContent line.get("product").get("_identifier")
				else
					@$.propertyValue.setContent ""
				return
		}
		{
			kind: "OB.OBPOSPointOfSale.UI.LineProperty"
			position: 20
			name: "qtyLine"
			I18NLabel: "OBPOS_LineQuantity"
			render: (line) ->
				if line
					@$.propertyValue.setContent line.printQty()
				else
					@$.propertyValue.setContent ""
				return
		}
		{
			kind: "OB.OBPOSPointOfSale.UI.LineProperty"
			position: 30
			name: "priceLine"
			I18NLabel: "OBPOS_LinePrice"
			render: (line) ->
				if line
					@$.propertyValue.setContent line.printPrice()
				else
					@$.propertyValue.setContent ""
				return
		}
		{
			kind: "OB.OBPOSPointOfSale.UI.LineProperty"
			position: 40
			name: "discountedAmountLine"
			I18NLabel: "OBPOS_LineDiscount"
			render: (line) ->
				if line
					@$.propertyValue.setContent line.printDiscount()
				else
					@$.propertyValue.setContent ""
				return
		}
		{
			kind: "OB.OBPOSPointOfSale.UI.LineProperty"
			position: 50
			name: "grossLine"
			I18NLabel: "OBPOS_LineTotal"
			render: (line) ->
				if line
					if line.get("priceIncludesTax")
						@$.propertyValue.setContent line.printGross()
					else
						@$.propertyValue.setContent line.printNet()
				else
					@$.propertyValue.setContent ""
				return
		}
	]
	published:
		receipt: null

	events:
		onDeleteLine: ""
		onEditLine: ""
		onReturnLine: ""
		onAttributeLine: ""
		onShowPopup: ""


	handlers:
		onCheckBoxBehaviorForTicketLine: "checkBoxBehavior"

	checkBoxBehavior: (inSender, inEvent) ->
		if inEvent.status
			@line = null

			#WARN! When off is done the components which are listening to this event
			#are removed. Because of it, the callback for the selected event are saved
			#and then recovered.
			@selectedCallbacks = @receipt.get("lines")._callbacks.selected
			@receipt.get("lines").off "selected"
			@render()
		else

			#WARN! recover the callbacks for the selected events
			@receipt.get("lines")._callbacks.selected = @selectedCallbacks
			if @receipt.get("lines").length > 0
				line = @receipt.get("lines").at(0)
				line.trigger "selected", line
		return

	executeOnShow: (args) ->
		if args and args.discounts
			@$.defaultEdit.hide()
			@$.discountsEdit.show()
			return
		@$.defaultEdit.show()
		@$.discountsEdit.hide()
		return

	components: [
		{
			kind: "OB.OBPOSPointOfSale.UI.Discounts"
			showing: false
			name: "discountsEdit"
		}
		{
			name: "defaultEdit"
			style: "background-color: #ffffff; color: black; height: 200px; margin: 5px; padding: 5px"
			components: [
				name: "msgedit"
				classes: "row-fluid"
				showing: false
				components: [
					{
						classes: "span12"
						components: [
							{
								kind: "OB.UI.SmallButton"
								i18nContent: "OBPOS_ButtonDelete"
								classes: "btnlink-orange"
								tap: ->
									@owner.doDeleteLine line: @owner.line
									return

								init: (model) ->
									@model = model
									@model.get("order").on "change:isPaid change:isLayaway", ((newValue) ->
										if newValue
											if newValue.get("isPaid") is true or newValue.get("isLayaway") is true
												@setShowing false
												return
										@setShowing true
										return
									), this
									return
							}
							{
								kind: "OB.UI.SmallButton"
								i18nContent: "OBPOS_LblDescription"
								classes: "btnlink-orange"
								tap: ->
									@owner.doEditLine line: @owner.line
									return

								init: (model) ->
									@model = model
									@model.get("order").on "change:isPaid change:isLayaway", ((newValue) ->
										if newValue
											if newValue.get("isPaid") is true or newValue.get("isLayaway") is true
												@setShowing false
												return
										@setShowing true
										return
									), this
									return
							}
							{
								kind: "OB.UI.SmallButton"
								name: "returnLine"
								i18nContent: "OBPOS_LblReturnLine"
								permission: "OBPOS_ReturnLine"
								classes: "btnlink-orange"
								showing: false
								tap: ->
									@owner.doReturnLine line: @owner.line
									return

								init: (model) ->
									@model = model
									@setShowing true  if OB.POS.modelterminal.get("permissions")[@permission]
									@model.get("order").on "change:isPaid change:isLayaway change:isQuotation", ((newValue) ->
										if newValue
											if newValue.get("isPaid") is true or newValue.get("isLayaway") is true or newValue.get("isQuotation") is true
												@setShowing false
												return
										@setShowing true  if OB.POS.modelterminal.get("permissions")[@permission]
										return
									), this
									return
							}
							{
								kind: "OB.UI.SmallButton"
								name: "removeDiscountButton"
								i18nContent: "OBPOS_LblRemoveDiscount"
								showing: false
								classes: "btnlink-orange"
								tap: ->
									if @owner and @owner.line and @owner.line.get("promotions")
										@owner.line.unset "promotions"
										@model.get("order").calculateGross()
										@hide()
									return

								init: (model) ->
									@model = model
									return
							}
							{
								kind: "OB.OBPOSPointOfSale.UI.EditLine.OpenStockButton"
								name: "checkStockButton"
								showing: false
							}
							{
							name: "attributeLineButton"
							kind: "OB.UI.SmallButton"
							i18nContent: "TSRR_LblAttributeLineButton"
							classes: "btnlink-orange"
							showing: true
							tap: ->
								console.log "TSRR_LblAttributeLineButton clicked"
								if @owner and @owner.line
									@owner.doShowPopup
										popup: "TSRR_Main_UI_AttributePopup"
										args:
											owner: @owner
											line: @owner.line
											order: @model.get("order")
											action: (dialog) ->
												console.log 'nothing special'
								return

							init: (model) ->
								@model = model
								return
							}
						]
					}
					{
						kind: "OB.UI.List"
						name: "returnreason"
						classes: "combo"
						style: "width: 100%; margin-bottom: 0px; height: 30px "
						events:
							onSetReason: ""

						handlers:
							onchange: "changeReason"

						changeReason: (inSender, inEvent) ->
							if @children[@getSelected()].getValue() is ""
								@owner.line.unset "returnReason"
							else
								@owner.line.set "returnReason", @children[@getSelected()].getValue()
							return

						renderHeader: enyo.kind(
							kind: "enyo.Option"
							initComponents: ->
								@inherited arguments
								@setValue ""
								@setContent OB.I18N.getLabel("OBPOS_ReturnReasons")
								return
						)
						renderLine: enyo.kind(
							kind: "enyo.Option"
							initComponents: ->
								@inherited arguments
								@setValue @model.get("id")
								@setContent @model.get("_identifier")
								return
						)
						renderEmpty: "enyo.Control"
					}
					{
						classes: "span12"
						components: [
							{
								classes: "span7"
								kind: "Scroller"
								name: "linePropertiesContainer"
								maxHeight: "134px"
								thumb: true
								horizontal: "hidden"
								style: "padding: 8px 0px 4px 25px; line-height: 120%;"
							}
							{
								classes: "span4"
								sytle: "text-align: right"
								components: [
									style: "padding: 2px 10px 10px 10px;"
									components: [
										{
											tag: "div"
											classes: "image-wrap image-editline"
											contentType: "image/png"
											style: "width: 128px; height: 128px"
											components: [
												tag: "img"
												name: "icon"
												style: "margin: auto; height: 100%; width: 100%; background-size: contain; background-repeat:no-repeat; background-position:center;"
											]
										}
										{
											name: "editlineimage"
											kind: "OB.UI.Thumbnail"
											classes: "image-wrap image-editline"
											width: "105px"
											height: "105px"
										}
									]
								]
							}
						]
					}
					{
						name: "msgaction"
						style: "padding: 10px;"
						components: [
							name: "txtaction"
							style: "float:left;"
						]
					}
				]
			]
		}
	]
	selectedListener: (line) ->
		@$.returnreason.setSelected 0
		@line.off "change", @render  if @line
		@line = line
		@line.on "change", @render, this  if @line
		if @line and @line.get("product").get("showstock") and not @line.get("product").get("ispack") and OB.POS.modelterminal.get("connectedToERP")
			@$.checkStockButton.show()
		else
			@$.checkStockButton.hide()
		if @line and @line.get("promotions")
			if @line.get("promotions").length > 0
				filtered = undefined
				filtered = _.filter(@line.get("promotions"), (prom) ->

					#discrectionary discounts ids
					prom.discountType is "20E4EC27397344309A2185097392D964" or prom.discountType is "D1D193305A6443B09B299259493B272A" or prom.discountType is "8338556C0FBF45249512DB343FEFD280" or prom.discountType is "7B49D8CC4E084A75B7CB4D85A6A3A578"
				, this)

				#lines with just discrectionary discounts can be removed.
				@$.removeDiscountButton.show()  if filtered.length is @line.get("promotions").length
		else
			@$.removeDiscountButton.hide()
		if (not _.isUndefined(line) and not _.isUndefined(line.get("originalOrderLineId"))) or @model.get("order").get("orderType") is 1
			@$.returnLine.hide()
		else @$.returnLine.show()  if OB.POS.modelterminal.get("permissions")[@$.returnLine.permission] and not (@model.get("order").get("isPaid") is true or @model.get("order").get("isLayaway") is true or @model.get("order").get("isQuotation") is true)
		@render()
		return

	receiptChanged: ->
		@inherited arguments
		@line = null
		@receipt.get("lines").on "selected", @selectedListener, this
		return

	render: ->
		me = this
		selectedReason = undefined
		@inherited arguments
		if @line
			@$.msgaction.hide()
			@$.msgedit.show()
			if OB.MobileApp.model.get("permissions")["OBPOS_retail.productImages"]
				@$.icon.applyStyle "background-image", "url(" + OB.UTIL.getImageURL(@line.get("product").get("id")) + "), url(" + "../org.openbravo.mobile.core/assets/img/box.png" + ")"
				@$.editlineimage.hide()
			else
				@$.editlineimage.setImg @line.get("product").get("img")
				@$.icon.parent.hide()
			if @line.get("gross") < OB.DEC.Zero
				unless _.isUndefined(@line.get("returnReason"))
					selectedReason = _.filter(@$.returnreason.children, (reason) ->
						reason.getValue() is me.line.get("returnReason")
					)[0]
					@$.returnreason.setSelected selectedReason.getNodeProperty("index")
				@$.returnreason.show()
			else
				@$.returnreason.hide()
		else
			@$.txtaction.setContent OB.I18N.getLabel("OBPOS_NoLineSelected")
			@$.msgedit.hide()
			@$.msgaction.show()
			if OB.MobileApp.model.get("permissions")["OBPOS_retail.productImages"]
				@$.icon.applyStyle "background-image", ""
			else
				if OB.MobileApp.model.get("permissions")["OBPOS_retail.productImages"]
					@$.icon.applyStyle "background-image", ""
				else
					@$.editlineimage.setImg null
		enyo.forEach @$.linePropertiesContainer.getComponents(), ((compToRender) ->
			compToRender.render @line  if compToRender.kindName.indexOf("enyo.") isnt 0
			return
		), this
		return

	initComponents: ->
		sortedPropertiesByPosition = undefined
		@inherited arguments
		sortedPropertiesByPosition = _.sortBy(@propertiesToShow, (comp) ->
			(if comp.position then comp.position else ((if comp.position is 0 then 0 else 999)))
		)
		enyo.forEach sortedPropertiesByPosition, ((compToCreate) ->
			@$.linePropertiesContainer.createComponent compToCreate
			return
		), this
		return

	init: (model) ->
		errorCallback = (tx, error) ->
			OB.UTIL.showError "OBDAL error: " + error
			return
		successCallbackReasons = (dataReasons, me) ->
			if dataReasons and dataReasons.length > 0
				me.reasons.reset dataReasons.models
			else
				me.reasons.reset()
			return
		@model = model
		@reasons = new OB.Collection.ReturnReasonList()
		@$.returnreason.setCollection @reasons
		OB.Dal.find OB.Model.ReturnReason, null, successCallbackReasons, errorCallback, this
		return

enyo.kind
	kind: "OB.UI.SmallButton"
	name: "OB.OBPOSPointOfSale.UI.EditLine.OpenStockButton"
	events:
		onShowLeftSubWindow: ""

	content: ""
	classes: "btnlink-orange"
	tap: ->
		product = @owner.line.get("product")
		params = {}

		#show always or just when the product has been set to show stock screen?
		if product.get("showstock") and not product.get("ispack") and OB.POS.modelterminal.get("connectedToERP")
			params.leftSubWindow = OB.OBPOSPointOfSale.UICustomization.stockLeftSubWindow
			params.product = product
			@doShowLeftSubWindow params
		return

	initComponents: ->
		@inherited arguments
		@setContent OB.I18N.getLabel("OBPOS_checkStock")
		return
