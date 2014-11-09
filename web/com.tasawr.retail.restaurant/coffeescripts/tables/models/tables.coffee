#global enyo, Backbone, $

class Table extends OB.Data.ExtensibleModel
	modelName: "Table"
	tableName: "tsrr_table"
	entityName: "TSRR_Table"
	url: '../../org.openbravo.service.json.jsonrest/TSRR_Table'
	source: "com.tasawr.retail.restaurant.data.Table"
	dataLimit: 300
	_id: 'modeltable'

	initialize: (attributes) ->
		tableId = undefined
		if attributes and attributes.id and attributes.json
			tableId = attributes.id
			attributes = JSON.parse(attributes.json)
			attributes.id = tableId
		if attributes
			@set "undo", attributes.undo
			@set "id", attributes.id if attributes.id
			@set "tsrrSection", attributes.tsrrSection if attributes.tsrrSection
			@set "name", attributes.name if attributes.name
			@set "chairs", attributes.chairs if attributes.chairs
			@set "smokingType", attributes.smokingType if attributes.smokingType
			@set "locked", attributes.locked if attributes.locked
			@set "locker", attributes.locker if attributes.locker
			_.each _.keys(attributes), ((key) ->
				@set key, attributes[key]  unless @has(key)
				return
			), @
		else
			@clearTableAttributes()
		return

	clear: ->
		@clearTableAttributes()
		@trigger "change"
		@trigger "clear"
		return

	clearTableAttributes: ->
		@set "id", null
		@set "name", null
		@set "chairs", null
		@set "smokingType", null
		@set "locked", null
		@set "locker", null
		@set "tsrrSection", null

	save: ->
		me = @
		undoCopy = undefined
		delete @attributes.json  if @attributes.json # Needed to avoid recursive inclusions of itself !!!
		undoCopy = @get("undo")
		@unset "undo"
		@.set 'tsrrSection', @get('tsrrSection') if @attributes.tsrrSection
		@.set 'name', @get 'name'
		@.set 'chairs', @get 'chairs'
		@.set 'smokingType', @get 'smokingType'
		@.set 'locked', @get 'locked'
		@.set 'locker', @get 'locker'
		unless OB.POS.modelterminal.get("preventOrderSave")
			OB.Dal.save @, (->
				me.trigger 'sync'
				console.log 'DONE'
			), ->
				console.error arguments
				return

		@set "undo", undoCopy
		return

	saveTable: (silent) ->
		me = @
		@.set 'tsrrSection', @get 'tsrrSection' if @attributes.tsrrSection
		@.set 'name', @get 'name'
		@.set 'chairs', @get 'chairs'
		@.set 'smokingType', @get 'smokingType'
		@.set 'locked', @get 'locked'
		@.set 'locker', @get 'locker'
		@set "_identifier", @get("name")
		unless OB.POS.modelterminal.get("preventOrderSave")
			OB.Dal.save @, (->
				me.trigger 'sync'
				console.log 'DONE'
			), ->
				console.error arguments
				return
		return

	clearWith: (_table) ->
		me = @
		undf = undefined
		if _table is null
			@set "id", null
			@set "name", null
			@set "chairs", null
			@set "smokingType", null
			@set "locked", null
			@set "locker", null
			@set "tsrrSection", null
		else
			_.each _.keys(_table.attributes), (key) ->
				if _table.get(key) isnt undf
					if _table.get(key) is null
						me.set key, null
					else if _table.get(key).at
						#collection
						me.get(key).reset()
						_table.get(key).forEach (elem) ->
							me.get(key).add elem
							return
					else
						#property
						me.set key, _table.get(key)
				return

		@set "isEditable", _table.get("isEditable")
		@trigger "change"
		@trigger "clear"
		return


	setBusinessPartnerAndCreateOrder: (businessPartner) ->
		OB.info 'CREATING... order and booking'
		me = @
		orderList = new OB.Collection.OrderList()
		salesOrder = orderList.newOrder()
		salesOrder.set 'bp', businessPartner
		salesOrder.set 'restaurantTable', me
		#salesOrder.set 'restaurantTable$_identifier', me.name
#		salesOrder.set "client", OB.POS.modelterminal.get("terminal").client
#		salesOrder.set "organization", OB.POS.modelterminal.get("terminal").organization
#		salesOrder.set "createdBy", OB.POS.modelterminal.get("orgUserId")
#		salesOrder.set "updatedBy", OB.POS.modelterminal.get("orgUserId")
#		salesOrder.set "documentType", OB.POS.modelterminal.get("terminal").terminalType.documentType
#		salesOrder.set "orderType", 0 # 0: Sales order, 1: Return order, 2: Layaway, 3: Void Layaway
#		salesOrder.set "generateInvoice", false
#		salesOrder.set "isQuotation", false
#		salesOrder.set "oldId", null
#		salesOrder.set "session", OB.POS.modelterminal.get("session")
#		salesOrder.set "priceList", OB.POS.modelterminal.get("terminal").priceList
#		salesOrder.set "priceIncludesTax", OB.POS.modelterminal.get("pricelist").priceIncludesTax
#		salesOrder.set "generateInvoice", OB.POS.modelterminal.get("terminal").terminalType.generateInvoice
#		salesOrder.set "currency", OB.POS.modelterminal.get("terminal").currency
#		salesOrder.set "currency" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("terminal")["currency" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER]
#		salesOrder.set "warehouse", OB.POS.modelterminal.get("terminal").warehouse
#		salesOrder.set "salesRepresentative", OB.POS.modelterminal.get("context").user.id
#		salesOrder.set "salesRepresentative" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("context").user._identifier
#		salesOrder.set "posTerminal", OB.POS.modelterminal.get("terminal").id
#		salesOrder.set "posTerminal" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("terminal")._identifier
#		salesOrder.set "orderDate", new Date()
#		salesOrder.set "isPaid", false
#		salesOrder.set "paidOnCredit", false
#		salesOrder.set "isLayaway", false
#		salesOrder.set "taxes", null
#		salesOrder.set "print", true
#		salesOrder.set "sendEmail", false
#		salesOrder.set "openDrawer", false
		salesOrder.save()

		bi = new OB.Model.BookingInfo()
		bi.set 'businessPartner', businessPartner
		bi.set 'salesOrder', salesOrder
		bi.set 'orderidlocal', salesOrder.id
		bi.set 'ebid', salesOrder.id
		bi.set 'restaurantTable', me
		bi.save()
		TSRR.Tables.Config.currentOrderId = salesOrder.get 'id'
		TSRR.Tables.Config.currentOrder = salesOrder
		TSRR.Tables.Config.currentTable = JSON.parse(localStorage.getItem('currentTable'))
		TSRR.Tables.Config.currentBookingInfo = bi

		salesOrder


	loadByJSON: (obj) ->
		me = this
		undf = undefined
		_.each _.keys(me.attributes), (key) ->
			if obj[key] isnt undf
				if obj[key] is null
					me.set key, null
				else
					me.set key, obj[key]
			return

		return

	serializeToJSON: ->
		JSON.parse JSON.stringify(@toJSON())


Table.addProperties [
	{
		name: "id"
		column: "tsrr_table_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "tsrrSection"
		column: "tsrr_section_id"
		type: "TEXT"
	}
	{
		name: "name"
		column: "name"
		type: "TEXT"
	}
	{
		name: "chairs"
		column: "chairs"
		type: "NUMERIC"
	}
	{
		name: "smokingType"
		column: "smokingType"
		type: "TEXT"
	}
	{
		name: "locked"
		column: "locked"
		type: "TEXT"
	}
	{
		name: "locker"
		column: "locker"
		type: "TEXT"
	}
	{
		name: "_identifier"
		column: "_identifier"
		type: "TEXT"
	}
]

OB.Data.Registry.registerModel Table
