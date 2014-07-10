enyo.kind
  name: "OB.UI.SalesOrder"
  kind: "OB.UI.SmallButton"
  classes: "btnlink btnlink-small btnlink-gray"
  style: "float:left; margin:7px; height:27px; padding: 4px 15px 7px 15px;"
  published:
    order: null

  events:
    onShowPopup: ""

  tap: ->
    @doShowPopup popup: "modalsalesorder"  unless @disabled
    return

  init: (model) ->
    unless OB.POS.modelterminal.hasPermission(@permission)
      @parent.parent.parent.hide()
    else
      @parent.parent.parent.hide()  unless OB.POS.modelterminal.hasPermission(@permissionOption)
    @setOrder model.get("order")
    return

  renderSalesOrder: (newSalesOrder) ->
    @setContent newSalesOrder
    return

  orderChanged: (oldValue) ->
    if @order.get("documentNo")
      @renderSalesOrder @order.get("documentNo")
    else
      @renderSalesOrder ""
#    @order.on "change:documentNo$_identifier change:documentNo", ((model) ->
#      if not _.isUndefined(model.get("documentNo$_identifier")) and not _.isNull(model.get("documentNo$_identifier"))
#        @renderSalesOrder model.get("documentNo$_identifier")
#      else
#        @renderSalesOrder ""
#      return
#    ), this
    return