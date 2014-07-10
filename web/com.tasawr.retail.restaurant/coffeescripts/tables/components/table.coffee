# Table Item
enyo.kind
  name: 'TSRR.Tables.TableItem'
  classes: 'span4 table-item'
  amount: 0
  components: [
    name: 'table'
    kind: 'TSRR.Tables.WebPOSComponent'
  ]
  events:
    onSelectTable: ''

  create: ->
    @inherited arguments
    @model.on 'change', @updateTable, @
    @updateTable()

  initComponents: ->
    @inherited arguments

  tap: (inSender, inEvent) ->
    # Sending the event to the components above this one
    @bubble 'onSelectTable'


  updateTable: ->
    myTable = @
    tableComponent = @$.table
    console.log "#{@model.get 'name'} is updated"
    tableComponent.setLabel @model.get 'name'
    tableComponent.setChairs @model.get 'chairs'
    tableComponent.setSmoking @model.get 'smokingType'
    tableComponent.setAmount myTable.amount


    if @model.get 'locked'
      console.log 'table ' + @model.get('name') + ' is locked'
      tableComponent.removeClass 'empty'
      tableComponent.addClass 'locked'

      if OB.POS.modelterminal.usermodel.get('id') == @model.get('locker')
        tableComponent.setDisabled false
        tableComponent.setLocker('locked by me')
      else
        tableComponent.setDisabled true
        tableComponent.setLocker('locked by others')
    else
      console.log 'not locked'

    criteria =
      restaurantTable: @model.id
    OB.Dal.find OB.Model.BookingInfo, criteria, ((bookingInfos) =>
      if bookingInfos and bookingInfos.length > 0
        tableComponent.setOrderCount bookingInfos.length
        @model.bookingInfoList = bookingInfos
        tableComponent.removeClass 'empty'
        tableComponent.addClass 'active'
        for bi in bookingInfos.models
          localOrderId = bi.get 'salesOrder' # valid local order id (ref working)
          OB.info 'order found in current bookin info with ORDER ID: ' + localOrderId
          OB.Dal.get OB.Model.Order, localOrderId, ((localOrder) =>
            OB.info 'local order found with ID: ' + localOrder.get('id')
            localOrder.calculateGross()
            myTable.amount += localOrder.getGross()
            OB.info 'the amount for above orderID is: ' + myTable.amount
            tableComponent.setAmount myTable.amount
          ), =>
            console.error 'something went wrong while fetching booking info for table : ' + @model.get 'name'
      else  # end booking condition
        tableComponent.setOrderCount 0
        OB.info 'no booking info found'
    ), =>
      console.error 'something went wrong while fetching booking info for table : ' + @model.get 'name'


enyo.kind
  name: 'TSRR.Attributes.AttributeItem'
  classes: 'span-cal empty span6'
  model: null
  components: [
    style: 'margin: 5px;'
    components: [
      name: "attributeName"
    ,
      name: "attributeValue"

    ]
  ]
  handlers:
    onAttributeSelected: 'attributeSelected'

  create: ->
    @inherited arguments
    if @attributeName && @attributeValues
      me = @
      @$.attributeName.setContent @attributeName
      x = @attributeValues.substring 1, @attributeValues.length - 1
      z = x.split ","
      _.each z, (attrVal) ->
        me.$.attributeValue.createComponent(
          kind: "TSRR.Buttons.Attributes"
          model: attrVal
          attribs: me
        )

  initComponents: ->
    @inherited arguments

  attributeSelected: (inSender, inEvent) ->
    OB.info 'attribute selected'
