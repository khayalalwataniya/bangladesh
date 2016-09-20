##global enyo, Backbone, _, $
#enyo.kind
#	name: "OB.UI.ModalReceiptLinesProperties"
#	kind: "OB.UI.ModalAction"
#	handlers:
#		onApplyChanges: "applyChanges"
#
#	executeOnShow: ->
#		@autoDismiss = true
#		@autoDismiss = false  if this and @args and @args.autoDismiss is false
#		return
#
#	executeOnHide: ->
#		if @args and @args.requiredFiedls and @args.requiredFieldNotPresentFunction
#			smthgPending = _.find(@args.requiredFiedls, (fieldName) ->
#				OB.UTIL.isNullOrUndefined @currentLine.get(fieldName)
#			, this)
#			@args.requiredFieldNotPresentFunction @currentLine, smthgPending  if smthgPending
#		return
#
#	i18nHeader: "OBPOS_ReceiptLinePropertiesDialogTitle"
#	bodyContent:
#		kind: "Scroller"
#		maxHeight: "225px"
#		style: "background-color: #ffffff;"
#		thumb: true
#		horizontal: "hidden"
#		components: [
#			name: "attributes"
#		]
#
#	bodyButtons:
#		components: [
#			{
#				kind: "OB.UI.ReceiptPropertiesDialogApply"
#				name: "receiptLinePropertiesApplyBtn"
#			}
#			{
#				kind: "OB.UI.ReceiptPropertiesDialogCancel"
#				name: "receiptLinePropertiesCancelBtn"
#			}
#		]
#
#	loadValue: (mProperty, component) ->
#		@waterfall "onLoadValue",
#			model: @currentLine
#			modelProperty: mProperty
#
#
#		# Make it visible or not...
#		if component.showProperty
#			component.showProperty @currentLine, (value) ->
#				component.owner.owner.setShowing value
#				return
#
#		return
#
#	# else make it visible...
#	applyChanges: (inSender, inEvent) ->
#		me = @
#		diff = undefined
#		att = undefined
#		result = true
#		diff = me.propertycomponents
#
#		for att of diff
#			result = result and diff[att].applyValue(me.currentLine)  if diff[att].owner.owner.getShowing() if diff.hasOwnProperty(att)
#			diff[att].applyChange(inSender, inEvent) if result
#
#		result
#
#	validationMessage: (args) ->
#		@owner.doShowPopup
#			popup: "modalValidateAction"
#			args: args
#
#		return
#
#	initComponents: ->
#		@inherited arguments
#		@attributeContainer = @$.bodyContent.$.attributes
#		@setHeader OB.I18N.getLabel(@i18nHeader)
#		@propertycomponents = {}
#		enyo.forEach @newAttributes, ((natt) ->
#			editline = @$.bodyContent.$.attributes.createComponent(
#				kind: "OB.UI.PropertyEditLine"
#				name: "line_" + natt.name
#				newAttribute: natt
#			)
#			@propertycomponents[natt.modelProperty] = editline.propertycomponent
#			@propertycomponents[natt.modelProperty].propertiesDialog = this
#			return
#		), this
#		return
#
#	init: (model) ->
#		@model = model
#		@model.get("order").get("lines").on "selected", ((lineSelected) ->
#			diff = undefined
#			att = undefined
#			@currentLine = lineSelected
#			if lineSelected
#				diff = @propertycomponents
#				for att of diff
#					@loadValue att, diff[att]  if diff.hasOwnProperty(att)
#			return
#		), this
#		return
#
#enyo.kind
#	name: "OB.UI.ModalReceiptLinesPropertiesImpl"
#	kind: "OB.UI.ModalReceiptLinesProperties"
#	newAttributes: [
#		kind: "OB.UI.renderTextProperty"
#		name: "receiptLineDescription"
#		modelProperty: "description"
#		i18nLabel: "OBPOS_LblDescription"
#	]
#
#enyo.kind
#	kind: "OB.UI.ModalInfo"
#	name: "OB.UI.ValidateAction"
#	header: ""
#	isDefaultAction: true
#	bodyContent:
#		name: "message"
#		content: ""
#
#	executeOnShow: ->
#		@$.header.setContent @args.header
#		@$.bodyContent.$.message.setContent @args.message
#		return
