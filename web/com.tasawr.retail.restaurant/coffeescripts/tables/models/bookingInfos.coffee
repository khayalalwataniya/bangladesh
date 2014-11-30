#global Backbone, _

class  BookingInfo extends OB.Data.ExtensibleModel
	modelName: "BookingInfo"
	tableName: "tsrr_booking_info"
	entityName: "TSRR_BookingInfo"
	url: '../../org.openbravo.service.json.jsonrest/TSRR_BookingInfo'
	source: "com.tasawr.retail.restaurant.data.BookingInfo"
	dataLimit: 300

	_id: 'modelbookinginfo'

	initialize: (attributes) ->
		bookinginfoId = undefined
		if attributes and attributes.id and attributes.json
			bookinginfoId = attributes.id
			attributes = JSON.parse(attributes.json)
			attributes.id = bookinginfoId
		if attributes
			@set "undo", attributes.undo
			@set "id", attributes.id if attributes.id
			@set "restaurantTable", attributes.restaurantTable if attributes.restaurantTable
			@set "salesOrder", attributes.salesOrder if attributes.salesOrder
			@set "businessPartner", attributes.businessPartner if attributes.businessPartner
			@set "orderidlocal", attributes.orderidlocal if attributes.orderidlocal
			@set "ebid", attributes.ebid if attributes.ebid
			_.each _.keys(attributes), ((key) ->
				@set key, attributes[key]  unless @has(key)
				return
			), @
		else
			@clearBookingInfoAttributes()
		return

	clear: ->
		@clearBookingInfoAttributes()
		@trigger "change"
		@trigger "clear"
		return

	clearBookingInfoAttributes: ->
		@set "id", null
		@set "restaurantTable", null
		@set "salesOrder", null
		@set "businessPartner", null
		@set "orderidlocal", null
		@set "ebid", null

	save: ->
		me = @
		undoCopy = undefined
		delete @attributes.json  if @attributes.json # Needed to avoid recursive inclusions of itself !!!
		undoCopy = @get("undo")
		@unset "undo"
		@.set 'restaurantTable', @get('restaurantTable').id if @attributes.restaurantTable
		@.set 'businessPartner', @get('businessPartner').id  if @attributes.businessPartner
		@.set 'salesOrder', @get('salesOrder').id if @attributes.salesOrder
		@.set 'orderidlocal', @get('orderidlocal') if @attributes.orderidlocal
		@.set 'ebid', @get('ebid') if @attributes.ebid
		@set "_identifier", @get("id") if @attributes.id
		unless OB.POS.modelterminal.get("preventOrderSave")
			OB.Dal.save @, (->
				OB.info "DONE"
			), ->
				console.error arguments
				return

		@set "undo", undoCopy
		return

	saveBookingInfo: (silent) ->
		me = @
		@.set 'restaurantTable', @get('restaurantTable') if @attributes.restaurantTable
		@.set 'businessPartner', @get('businessPartner') if @attributes.businessPartner
		@.set 'salesOrder', @get('salesOrder') if @attributes.salesOrder
		@.set 'orderidlocal', @get('orderidlocal') if @attributes.orderidlocal
		@.set 'ebid', @get('ebid') if @attributes.ebid
		@set "_identifier", @get("id") if @attributes.id
		unless OB.POS.modelterminal.get("preventOrderSave")
			OB.Dal.save @, (->
				OB.info 'DONE'
			), ->
				console.error arguments
				return
		return


	clearWith: (_bookingInfo) ->
		me = @
		undf = undefined
		if _bookingInfo is null
			@set "id", null
			@set "restaurantTable", null
			@set "salesOrder", null
			@set "businessPartner", null
			@set "orderidlocal", null
			@set "ebid", null
		else
			_.each _.keys(_bookingInfo.attributes), (key) ->
				if _bookingInfo.get(key) isnt undf
					if _bookingInfo.get(key) is null
						me.set key, null
					else if _bookingInfo.get(key).at
						#collection
						me.get(key).reset()
						_bookingInfo.get(key).forEach (elem) ->
							me.get(key).add elem
							return
					else
						#property
						me.set key, _bookingInfo.get(key)
				return

		@set "isEditable", _bookingInfo.get("isEditable")
		@trigger "change"
		@trigger "clear"
		return


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


BookingInfo.addProperties [
	{
		name: "id"
		column: "tsrr_booking_info_id"
		primaryKey: true
		type: "TEXT"
	}
	{
		name: "restaurantTable"
		column: "tsrr_table_id"
		type: "TEXT"
	}
	{
		name: "businessPartner"
		column: "c_bpartner_id"
		type: "TEXT"
	}
	{
		name: "salesOrder"
		column: "c_order_id"
		type: "TEXT"
	}
	{
		name: "orderidlocal"
		column: "orderidlocal"
		type: "TEXT"
	}
	{
		name: "ebid"
		column: "ebid"
		type: "TEXT"
	}
	{
		name: "_identifier"
		column: "_identifier"
		type: "TEXT"
	}
]

OB.Data.Registry.registerModel BookingInfo
