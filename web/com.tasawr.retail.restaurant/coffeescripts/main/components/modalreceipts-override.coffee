enyo.kind
  name: "TSRR.UI.OrderLineView"
  kind: "OB.UI.SelectButton"
  classes: "split-line-item row-fluid"
  published:
    line: null
  components: [
    name: "product"
    classes: "span10"
  ,
    name: "price"
    classes: "span2"
  ,
    style: "clear: both;"
  ]

  init: ->
    @inherited arguments

  initComponents: ->
    @inherited arguments

  create: ->
    @inherited arguments
    me = @
    if me.model isnt null and me.model isnt undefined
      me.setLine me.model
      me.$.product.setContent me.model.attributes.product.attributes._identifier
      me.$.price.setContent me.model.attributes.price

  lineChanged: ->
    console.log 'line has changed'

  render: ->
    console.log 'line rendered'

  tap: (inSender, inEvent) ->
    me = @
    _.each @parent.parent.parent.parent.$.order1.$.lines.$, (elem) ->
      elem.applyStyle('background-color', 'white')
    _.each @parent.parent.parent.parent.$.order2.$.lines.$, (elem) ->
      elem.applyStyle('background-color', 'white')
    @applyStyle 'background-color', 'green'
    @$.product.addClass 'selected-line'
    me.parent.parent.parent.parent.setSelectedLine(me.model)


enyo.kind
  name: "TSRR.UI.OrderLinesView"
  published:
    orderLines: null
  create: ->
    @inherited arguments
  orderLinesChanged: ->
    console.log 'order line changed, creating Components'
    me = @
    line = me.createComponent(
      kind: "TSRR.UI.OrderLineView"
      model: me.orderLines
    )

enyo.kind
  name: "TSRR.UI.SingleOrderView"
  kind: "enyo.Scroller"
  maxHeight: "1000px"
  published:
    singleOrder: null
  components: [
    name: "lines"
    kind: "TSRR.UI.OrderLinesView"
  ]

  create: ->
    @inherited arguments

  singleOrderChanged: ->
    console.log 'single order changed'

    me = @
    enyo.forEach me.singleOrder.attributes.lines.models, (lines) ->
      me.$.lines.setOrderLines lines


enyo.kind
  name: "TSRR.UI.SplitOrderView"
  classes: "row-fluid cleafix"
  fromOrder: ""
  toOrder: ""
  components: [
    kind: "TSRR.UI.SingleOrderView"
    name: "order1"
    classes: "span5"
  ,
    kind: "onyx.Button"
    name: "Switch"
    content: "Switch Order"
    classes: "span2"
    style: "margin-top: 60px;"
    ontap: 'buttonTapped'
  ,
    kind: "TSRR.UI.SingleOrderView"
    name: "order2"
    classes: "span5"
  ,
    style: "clear: both;"
  ]
  published:
    orders: null
    selectedLine: null
  handlers:
    onSplitOrderOkButton: "splitOrderOkPressed"

  buttonTapped: (inSender, inEvent) ->
    me = @
    line = me.getSelectedLine()
    console.log 'button was tapped again'
    addLineComponentToAnotherOrder(line, me)

  splitOrderOkPressed: (inSender, inEvent) ->
    me = @
    console.log "CALLING SplitOrderOkPressed"
    ordersOnPopup = inSender.parent.getOrders()
    _.each ordersOnPopup.models, (order) ->
      order.calculateGross()
      order.save()
    inSender.parent.hide()
#		@parent.parent.parent.parent.hide()
#		OB.POS.navigate "retail.pointofsale"
  create: ->
    @inherited arguments
  ordersChanged: ->
    @inherited arguments
    console.log 'main order(containing two single orders) has been changed'
    me = @
    if me.orders.models.length is 1
      newOrder = tsrrNewOrder()
      @orders.add(newOrder)
      me.$.order1.setSingleOrder me.orders.models[0]
      me.$.order2.setSingleOrder newOrder
      TSRR.Main.order2 = newOrder
      TSRR.Main.order1 = me.orders.models[0]

    else
      i = 1
      enyo.forEach me.orders.models, (model)->
        if 1 == i
          TSRR.Main.order1 = model
          me.$.order1.setSingleOrder model
        else
          TSRR.Main.order2 = model
          me.$.order2.setSingleOrder model
        i++

  selectedLineChange: ->
    console.log 'selected line has been changed'


addLineComponentToAnotherOrder = (line, orderComponents) ->
  anotherOrderComponent = findAnotherOrderComponent(line, orderComponents)

  containingOrderComponent = findLineContainingOrderComponent(line, orderComponents)

  lineComponent = findLineComponent(line, containingOrderComponent)

  anotherOrderComponent.singleOrder.attributes.lines.add lineComponent.model
  containingOrderComponent.singleOrder.attributes.lines.remove lineComponent.model

  anotherOrderComponent.$.lines.destroyComponents()

  containingOrderComponent.$.lines.destroyComponents()

  orderComponents.ordersChanged()

  anotherOrderComponent.singleOrderChanged()
  anotherOrderComponent.render()
  containingOrderComponent.singleOrderChanged()
  containingOrderComponent.render()


#    attributes:
#      style: "float: left; width: 10%; text-align: right;"
#  ,
#    name: "price"
#    attributes:
#      style: "float: left; width: 15%; text-align: right;"
#  ,
#    name: "gross"
#    attributes:
#      style: "float: left; width: 15%; text-align: right;"
#  ,
#    name: "businesspartner"
#    attributes:
#      style: "float: left; width: 15%; text-align: right;"
#  ,


#      me.$.quantity.setContent me.model.attributes.qty
#      me.$.price.setContent me.model.attributes.price
#      me.$.gross.setContent me.model.attributes.gross


findLineContainingOrder = (line, bothOrders) ->
  containingOrder = null

  _.each(bothOrders, (orderOb) ->
    _.each orderOb.attributes.lines._byCid, (orderLine) ->
      if line.cid is orderLine.cid
        containingOrder = orderOb
  )
  containingOrder


findAnotherOrder = (containingOrder, bothOrders) ->
  anotherOrder = null

  _.each bothOrders, (orderOb) ->
    if containingOrder isnt orderOb
      anotherOrder = orderOb

  anotherOrder


findLineContainingOrderComponent = (line, bothComponents) ->
  containingComponent = null
  containingOrder = findLineContainingOrder(line, bothComponents.getOrders()._byCid)
  _.each bothComponents.$, (orderComponent) ->
    if orderComponent.singleOrder is containingOrder
      containingComponent = orderComponent

  containingComponent


findAnotherOrderComponent = (line, bothComponents) ->
  anotherComponent = null

  containingOrder = findLineContainingOrder(line, bothComponents.getOrders()._byCid)
  anotherOrder = findAnotherOrder(containingOrder, bothComponents.getOrders()._byCid)
  _.each bothComponents.$, (orderComponent) ->
    if orderComponent.singleOrder is anotherOrder
      anotherComponent = orderComponent

  anotherComponent


findLineComponent = (line, containingOrderComponent) ->
  lineComponent = null
  _.each containingOrderComponent.$.lines.children, (lineButton) ->
    if lineButton.model is line
      lineComponent = lineButton

  lineComponent


#ctx.parent.parent.parent.parent.parent.model.attributes.orderList._reset()
#terminal_containerWindow_pointOfSale_multiColumn_leftPanel_receiptview_orderview_listOrderLines_tbody
#ctx.parent.parent.parent.parent.parent.$.multiColumn.$.leftPanel.$.receiptview.$.orderview.$.listOrderLines.collectionChanged()
#ctx.parent.parent.parent.parent.parent.$.multiColumn.$.leftPanel.$.multireceiptview.$.multiorderview.model.attributes.orderList.reset()

#terminal_containerWindow_pointOfSale_multiColumn_leftPanel_receiptview_orderview_listOrderLines_tbody_control14_renderOrderLine
#this.parent.parent.parent.parent.parent.$.multiColumn.$.leftPanel.$.receiptview.$.orderview.$.listOrderLines.collectionChanged()

#terminal_containerWindow_pointOfSale_multiColumn_rightPanel_toolbarpane_edit_edit_smallButton
#_.each(this.parent.$, function(x){console.log(x);});

tsrrNewOrder = ->
  if TSRR.Tables.Config.currentTable
    enyo.Signals.send "onCurrentTableSet", "sms"
    console.info 'table loaded'
    TSRR.Tables.Config.currentTable.setBusinessPartnerAndCreateOrder OB.POS.modelterminal.get("businessPartner")
  else
    OB.Dal.find OB.Model.Table,
      locked: false
    , ((collection) -> # inline callback
        console.log 'there are ' + collection.length + ' table'
        return  unless collection.length # no record found
        TSRR.Tables.Config.currentTable = collection.models[0]

        console.error 'table loaded'
        TSRR.Tables.Config.currentTable.setBusinessPartnerAndCreateOrder OB.POS.modelterminal.get("businessPartner")
      ), (tx) ->
      #console.log tx

  TSRR.Tables.Config.currentOrder
#	order = new OB.Model.Order()
#	order.set "client", OB.POS.modelterminal.get("terminal").client
#	order.set "organization", OB.POS.modelterminal.get("terminal").organization
#	order.set "createdBy", OB.POS.modelterminal.get("orgUserId")
#	order.set "updatedBy", OB.POS.modelterminal.get("orgUserId")
#	order.set "documentType", OB.POS.modelterminal.get("terminal").terminalType.documentType
#	order.set "orderType", 0 # 0: Sales order, 1: Return order, 2: Layaway, 3: Void Layaway
#	order.set "generateInvoice", false
#	order.set "isQuotation", false
#	order.set "oldId", null
#	order.set "session", OB.POS.modelterminal.get("session")
#	order.set "priceList", OB.POS.modelterminal.get("terminal").priceList
#	order.set "priceIncludesTax", OB.POS.modelterminal.get("pricelist").priceIncludesTax
#	order.set "generateInvoice", OB.POS.modelterminal.get("terminal").terminalType.generateInvoice
#	order.set "currency", OB.POS.modelterminal.get("terminal").currency
#	order.set "currency" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("terminal")["currency" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER]
#	order.set "warehouse", OB.POS.modelterminal.get("terminal").warehouse
#	order.set "salesRepresentative", OB.POS.modelterminal.get("context").user.id
#	order.set "salesRepresentative" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("context").user._identifier
#	order.set "posTerminal", OB.POS.modelterminal.get("terminal").id
#	order.set "posTerminal" + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER, OB.POS.modelterminal.get("terminal")._identifier
#	order.set "orderDate", new Date()
#	order.set "isPaid", false
#	order.set "paidOnCredit", false
#	order.set "isLayaway", false
#	order.set "taxes", null
#	documentseq = OB.POS.modelterminal.get("documentsequence") + 1
#	documentseqstr = OB.UTIL.padNumber(documentseq, 7)
#	OB.POS.modelterminal.set "documentsequence", documentseq
#	order.set "documentNo", OB.POS.modelterminal.get("terminal").docNoPrefix + "/" + documentseqstr
#	order.set "bp", OB.POS.modelterminal.get("businessPartner")
#	order.set "print", true
#	order.set "sendEmail", false
#	order.set "openDrawer", false
