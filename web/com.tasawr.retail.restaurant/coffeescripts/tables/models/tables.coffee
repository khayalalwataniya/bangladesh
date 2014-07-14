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


#  initialize: (attributes) ->
#    tableId = undefined
#    if attributes and attributes.id and attributes.json
#      tableId = attributes.id
#      attributes = JSON.parse(attributes.json)
#      attributes.id = tableId
#    if attributes AND attributes.tsrrSection
#      @set "tsrrSection", attributes.tsrrSection
#    if attributes
#      @set "undo", attributes.undo
#      @set "id", attributes.id if attributes.id
#      @set "name", attributes.name if attributes.name
#      @set "chairs", attributes.chairs if attributes.chairs
#      @set "smokingType", attributes.smokingType if attributes.smokingType
#      @set "locked", attributes.locked if attributes.locked
#      @set "locker", attributes.locker if attributes.locker
#    else
#      @clearTableAttributes()
#    return

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
    @.set 'tsrrSection', @get 'tsrrSection' if @attributes.tsrrSection
    @.set 'name', @get 'name'
    @.set 'chairs', @get 'chairs'
    @.set 'smokingType', @get 'smokingType'
    @.set 'locked', @get 'locked'
    @.set 'locker', @get 'locker'
    unless OB.POS.modelterminal.get("preventOrderSave")
      OB.Dal.save @, (->
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
    TSRR.Tables.Config.currentTable = me
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
