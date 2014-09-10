enyo.kind
	name: "TSRR.UI.ModalReceiptsSplit"
	kind: "OB.UI.Modal"
	header: ""
	published:
		receiptsInfo: null
#	i18nHeader: "OBPOS_LblAssignReceipt"
	body:
		kind: "TSRR.UI.ListReceiptsSplit"
		name: "listreceiptssplit"

	receiptsInfoChanged: (oldValue) ->
		me = @
		me.$.header.setContent OB.I18N.getLabel("OBPOS_LblAssignReceipt")
		if @receiptsInfo
			OB.Dal.find OB.Model.Order, session: me.receiptsInfo.get('session'), ((data) ->
				if data and data.length > 0
					me.$.body.$.listreceiptssplit.setReceiptsList data
			), (error) ->
				console.log error
		return

	executeOnShow: ->
		@setReceiptsInfo @args.receiptsInfo
		return
#		@$.body.$.listreceiptssplit.setReceiptsList @parent.model.attributes.orderList

	executeOnHide: ->
		@receiptsInfo = null
		return


enyo.kind
	name: "TSRR.UI.ListReceiptsSplit"
	classes: "row-fluid"
	published:
		receiptsList: null
#	events:
#		onChangeCurrentOrder: ""
	components: [
		classes: "span12"
		components: [
			{
				style: "border-bottom: 1px solid #cccccc;"
			}
			{
				components: [
					name: "receiptslistitemprintersplit"
					kind: "OB.UI.ScrollableTable"
					scrollAreaMaxHeight: "400px"
					renderLine: "TSRR.UI.ListReceiptLineSplit"
					renderEmpty: "OB.UI.RenderEmpty"
				]
			}
			{
				kind: "TSRR.UI.ListRecieptOkButton"
			}
			{
				style: "color: black;background-color: #d5d5d5;"
				kind: "OB.UI.ModalCancel_CancelButton"
			}
		]
	]
	receiptsListChanged: (oldValue) ->
		@$.receiptslistitemprintersplit.setCollection @receiptsList
		return

enyo.kind
	name: "TSRR.UI.ListReceiptLineSplit"
	classes: "btnselect"
#	kind: "OB.UI.SelectButton"
#	published:
#		receiptsList: null
#	events:
#		onHideThisPopup: ""
#	tap: ->
#		@inherited arguments
#		@doHideThisPopup()
#		return

	components: [
		name: "line"
		style: "line-height: 23px; width: 100%;"
		components: [
			{
				kind: 'TSRR.UI.ListReceiptLine'
				name: 'bp'
				allowHtml: true
			}
			{
				style: "float: left; width: 25%"
				name: "orderNo"
			}
			{
				style: "clear: both"
			}
		]
	]
	create: ->
		@inherited arguments
		@$.bp.setContent "<b>" + @model.get('documentNo') + " - " + @model.get("bp").get("_identifier") + " - " + @model.get('lines').length + " line items" + " </b><br/>"
#		for model in @model.collection.models
#			@$.bp.setContent "<b>" + @model.get('documentNo') + " - " + @model.get("bp").get("_identifier") + " - " + @model.get('lines').length + " line items" + " </b><br/>"

		return


OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
	kind: "TSRR.UI.ModalReceiptsSplit"
	name: "TSRR_UI_ModalReceiptsSplit"


enyo.kind
	name: "TSRR.UI.ListReceiptLine"
	kind: "OB.UI.CheckboxButton"
	classes: "modal-dialog-btn-check"
	events:
		onHideThisPopup: ""
	tap: ->
		@inherited arguments
		@parent.parent.model.set "checked", not @parent.parent.model.get "checked"
		return
	create: ->
		@inherited arguments
		#    @setContent @model.get("name")

		if @parent.parent.model.get 'checked'
			@addClass "active"
		else
			@removeClass "active"
		return


enyo.kind
	name: "TSRR.UI.ListRecieptOkButton"
	kind: "OB.UI.ModalDialogButton"
	style: "color: black; background-color: green;"
	isDefaultAction: true
	events:
		onListRecieptOkButton: ""
	tap: (inSender, inEvent) ->
		console.log 'ok button pressed'
		splitReciepts = jQuery.extend({}, @parent.parent.getReceiptsList())
		_.each splitReciepts.models, (order) ->
			if order.get('checked')
				console.log 'present'
			else
				splitReciepts.remove order
		@parent.parent.parent.parent.hide()
		@parent.parent.parent.parent.parent.doShowPopup
			popup: "TSRR_UI_SplitOrderPopup"
			args:
				model: splitReciepts

	initComponents: ->
		@inherited arguments
		@setContent "Ok"


enyo.kind
	name: "TSRR.UI.ListRecieptCancelButton"
	kind: "OB.UI.ModalDialogButton"
	style: "color: black; background-color: green;"
	isDefaultAction: true
	events:
		onListRecieptOkButton: ""

	tap: (inSender, inEvent) ->
		@doListRecieptCancelButton()

	initComponents: ->
		@inherited arguments
		@setContent "Cancel"



