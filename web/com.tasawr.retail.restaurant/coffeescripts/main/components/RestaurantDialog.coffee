#global enyo, Backbone, _, $

enyo.kind
	kind: "OB.UI.ModalDialogButton"
	name: "TSRR.Main.UI.LineAttributeDialogApply"
	isDefaultAction: true
	events:
		onApplyChanges: ""
	tap: ->
		addedAttributes = ''
		for key of localStorage
			if (key.indexOf("productAttribute") > -1)
				addedAttributes = addedAttributes + (localStorage.getItem key) + '_'
				localStorage.removeItem key

		if addedAttributes.charAt(0) is '_'
			addedAttributes = addedAttributes.substr(1)

		if $("#productAttributeSpan").length == 0
			$("li.selected").first().children().last().children().filter((index) ->
				index is 1
			).append "<div style='font-size: 14px;' id='productAttributeSpan'>" +addedAttributes.substring(0, addedAttributes.length - 1) + "</div>"
		else $("#productAttributeSpan").text addedAttributes.substring(0, addedAttributes.length - 1)

		@doHideThisPopup()
		return

	initComponents: ->
		@inherited arguments
		@setContent OB.I18N.getLabel("OBMOBC_LblApply")
		return

enyo.kind
	name: "TSRR.Main.UI.AttributePopup"
	kind: "OB.UI.ModalAction"
	i18nHeader: "TSRR_AttributeModalHeaderMessage"
	handlers:
		onApplyChanges: "applyChanges"

	executeOnShow: ->
		console.log "calling TSRR.Main.UI.AttributePopup.executeOnShow"
		@$.bodyContent.destroyClientControls()
		@loadAttributesFromProduct @args.line.attributes.product

		@autoDismiss = true
		@autoDismiss = false  if this and @args and @args.autoDismiss is false
		return

	executeOnHide: ->
		console.log "hiding TSRR.Main.UI.AttributePopup.executeOnHide"
		return

	bodyContent:
		components:[
			name: "productAttributes"
		]

	bodyButtons:
		components: [
			{
				kind: "TSRR.Main.UI.LineAttributeDialogApply"
			}
			{
				kind: "OB.UI.CancelDialogButton"
			}
		]
	initComponents: ->
		@inherited arguments

	init: (model) ->
		@model = model

	loadAttributesFromProduct: (product) ->
		me = @

		new OB.DS.Process("com.tasawr.retail.restaurant.data.ProductAttributeSetService").exec
			id: product.id
		, (data) ->
			console.error data
			me.loadAttributes data


	loadAttributes: (attributes) ->
		me = @
		_.each attributes, (attributeValues, attributeName) ->
			me.loadAttribute attributeName, attributeValues
		return

	loadAttribute: (attributeName, attributeValues) ->
		me = @
		@$.bodyContent.createComponent(
			kind: 'TSRR.Attributes.AttributeItem'
			attributeName: attributeName
			attributeValues: attributeValues
		)

		me.$.bodyContent.render()

	dalError: (tx, error) ->
		OB.UTIL.showError "OBDAL error: #{error}"


enyo.kind
	name: "TSRR.Main.UI.OriginalOrder"
	classes: "row-fluid"
	published:
		receipt: null
	handlers: null
	events: null
	components: [
		classes: "span12"
		components: [
			style: "border-bottom: 1px solid #cccccc;"
			classes: "row-fluid"
			components: [
				classes: "span12"
				components: [
					name: "lineItemList"
					kind: "OB.UI.ScrollableTable"
					scrollAreaMaxHeight: "400px"
					renderHeader: "TSRR.Main.UI.SummaryHeader"
					renderLine: "TSRR.Main.UI.SummaryRender"
					renderEmpty: "OB.UI.RenderEmpty"
				]
			]
		]
	]

	initComponents: ->
		@inherited arguments

	executeOnShow: ->
		console.log "calling executeOnShow on TSRR.Main.UI.OriginalOrder"


enyo.kind
	name: "TSRR.Main.UI.SplitedOrder"
	kind: "OB.OBPOSPointOfSale.UI.ReceiptView"

OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
	kind: "TSRR.Main.UI.AttributePopup"
	name: "TSRR_Main_UI_AttributePopup"