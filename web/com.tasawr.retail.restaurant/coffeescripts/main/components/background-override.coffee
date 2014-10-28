$(document).ready ->
  window.s = $(".enyo-body-fit")
  imageUrl = "../com.tasawr.retail.restaurant/images/linen_bg_tile.jpg"
  $(".enyo-body-fit").css "background-image", "url(" + imageUrl + ")"



#lineStatusChangePossible = (line, newStatus)->
#
#      currentStatus = localStorage.getItem line.cid
#
#      if currentStatus is 'Not sent' and newStatus is 'send'
#          return true
#      else if currentStatus is 'sent' and newStatus is 'hold' or 'cancel'
#          return true
#      else if currentStatus is 'held' and newStatus is 'cancelled' or 'fired'
#          return true
#      else if currentStatus is 'cancelled' and newStatus is 'send'
#          return true
#      else
#        return false
#
enyo.kind
  name: "OB.UI.OrderHeader"
  classes: "row-fluid span12"
  published:
    order: null

  style: "border-bottom: 1px solid #cccccc;"
  components: [
    components:[
      {
        kind: "OB.UI.OrderDetails"
        name: "orderdetails"
      }
      {
        kind: "TSRR.UI.OrderDetailsSectionTable"
        name: "orderdetailssectiontable"
      }
    ]

    {
      components: [
        {
          kind: "OB.UI.BusinessPartner"
          name: "bpbutton"
        }
        {
          kind: "OB.UI.BPLocation"
          name: "bplocbutton"
        }
      ]
    }
  ]
  orderChanged: (oldValue) ->
    @$.bpbutton.setOrder @order
    @$.bplocbutton.setOrder @order
    @$.orderdetails.setOrder @order

    @$.orderdetailssectiontable.setOrder @order

    return



enyo.kind
  name: "TSRR.UI.OrderDetailsSectionTable"
  published:
    order: null

  components: [
    kind: "Signals"
    onCurrentTableSet: "currentTableSet"
  ]
  attributes:
    style: "margin-left: 10px; font-weight: bold; color: #6CB33F;"


  renderData: ->
    me = @
    sectionTable = me.content

    sectionName = JSON.parse(localStorage.getItem('currentSection')).name
    if (me.content.indexOf(sectionName) == -1)
      sectionTable = sectionName + ' - '

    if TSRR.Tables.Config.currentOrder
      tableName = TSRR.Tables.Config.currentOrder.get('restaurantTable').name

      if (me.content.indexOf(tableName) == -1)
        sectionTable = sectionTable + tableName

    me.setContent sectionTable

    return


  currentTableSet: (inEvent, inParam)->

    @renderData()

  orderChanged: () ->

    @renderData()

    return




