enyo.kind
	kind: "OB.UI.listItemButton"
	name: "OB.UI.RenderOrderLine"
	classes: "btnselect-orderline"
	handlers:
		onChangeEditMode: "changeEditMode"
		onCheckBoxBehaviorForTicketLine: "checkBoxForTicketLines"

	events:
		onLineChecked: ""

	components: [
		{
			name: "checkBoxColumn"
			kind: "OB.UI.CheckboxButton"
			tag: "div"
			tap: ->

			style: "float: left; width: 10%;"
		}
		{
			name: "product"
			allowHtml: true
			attributes:
				style: "float: left; width: 40%;"
		}
		{
			name: "quantity"
			attributes:
				style: "float: left; width: 10%; text-align: right;"
		}
		{
			name: "price"
			attributes:
				style: "float: left; width: 15%; text-align: right;"
		}
		{
			name: "gross"
			attributes:
				style: "float: left; width: 15%; text-align: right;"
		}
		{
			name: "sendstatus"
			attributes:
				style: "float: left; width: 20%; text-align: right;"
		}
		{
			kind: "Signals"
			onTransmission: "transmission"
		}
		{
			style: "clear: both;"
		}
	]
	initComponents: ->
		@inherited arguments
		@$.checkBoxColumn.hide()
		@$.product.setContent @model.get("product").get("_identifier")
		@$.product.setContent(@model.get("product").get("_identifier") + '<br>-- ' + @model.get("description")) if @model.get("description")
		@$.quantity.setContent @model.printQty()
		@$.price.setContent @model.printPrice()
		if @model.get("priceIncludesTax")
			@$.gross.setContent @model.printGross()
		else
			@$.gross.setContent @model.printNet()

		if @model.get("product").get("characteristicDescription")
			@createComponent
				style: "display: block;"
				components: [
					{
						content: OB.UTIL.getCharacteristicValues(@model.get("product").get("characteristicDescription"))
						attributes:
							style: "float: left; width: 60%; color:grey"
					}
					{
						style: "clear: both;"
					}
				]

#		@$.sendstatus.setContent 'Not sent'
		unless @model.cid is null
			if window.localStorage.getItem(@model.cid) is null
				@$.sendstatus.setContent 'Not sent'
				window.localStorage.setItem @model.cid, 'Not sent'
			else
				@$.sendstatus.setContent localStorage.getItem @model.cid


		if @model.get("promotions")
			enyo.forEach @model.get("promotions"), ((d) ->

				# continue
				return  if d.hidden
				@createComponent
					style: "display: block;"
					components: [
						{
							content: "-- " + d.name
							attributes:
								style: "float: left; width: 80%;"
						}
						{
							content: OB.I18N.formatCurrency(-d.amt)
							attributes:
								style: "float: right; width: 20%; text-align: right;"
						}
						{
							style: "clear: both;"
						}
					]

				return
			), this
		OB.MobileApp.model.hookManager.executeHooks "OBPOS_RenderOrderLine",
			orderline: this
		, (args) ->

		return

	transmission: (inSender, inPayload) ->
		@inherited arguments
		if @model.cid == inPayload.cid
			@container.children[0].controls[5].setContent inPayload.message
			localStorage.setItem inPayload.cid, inPayload.message


	#All should be done in module side
	changeEditMode: (inSender, inEvent) ->
		@addRemoveClass "btnselect-orderline-edit", inEvent.edit
		@bubble "onShowColumn",
			colNum: 1

	checkBoxForTicketLines: (inSender, inEvent) ->
		if inEvent.status
			@$.gross.hasNode().style.width = "18%"
			@$.quantity.hasNode().style.width = "16%"
			@$.price.hasNode().style.width = "18%"
			@$.product.hasNode().style.width = "38%"
			@$.checkBoxColumn.show()
			@changeEditMode this, inEvent.status
		else
			@$.gross.hasNode().style.width = "20%"
			@$.quantity.hasNode().style.width = "20%"
			@$.price.hasNode().style.width = "20%"
			@$.product.hasNode().style.width = "40%"
			@$.checkBoxColumn.hide()
			@changeEditMode this, false
		return
