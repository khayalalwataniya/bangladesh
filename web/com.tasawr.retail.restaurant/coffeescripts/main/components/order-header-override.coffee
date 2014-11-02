#enyo.kind
#  name: "OB.UI.OrderHeader"
#  classes: "row-fluid span12"
#  published:
#    order: null
#
#  style: "border-bottom: 1px solid #cccccc;"
#  components: [
#    components:[
#      {
#        kind: "OB.UI.OrderDetails"
#        name: "orderdetails"
#      }
#      {
#        kind: "TSRR.UI.OrderDetailsSectionTable"
#        name: "orderdetailssectiontable"
#      }
#    ]
#
#    {
#      components: [
#        {
#          kind: "OB.UI.BusinessPartner"
#          name: "bpbutton"
#        }
#        {
#          kind: "OB.UI.BPLocation"
#          name: "bplocbutton"
#        }
#      ]
#    }
#  ]
#  orderChanged: (oldValue) ->
#    @$.bpbutton.setOrder @order
#    @$.bplocbutton.setOrder @order
#    @$.orderdetails.setOrder @order
#
#    @$.orderdetailssectiontable.setOrder @order
#
#    return
#
#
#
#enyo.kind
#  name: "TSRR.UI.OrderDetailsSectionTable"
#  published:
#    order: null
#
#  content: ""
#  components: [
#    kind: "Signals"
#    onCurrentTableSet: "currentTableSet"
#  ]
#  attributes:
#    style: "margin-left: 10px; font-weight: bold; color: #6CB33F;"
#
#
#  renderData: ->
#    me = @
#    sectionTable = me.content
#    try
#      sectionName = JSON.parse(localStorage.getItem('currentSection')).name
#    catch  e
#      console.error e
#
#
#    unless me.content is undefined
#      if (me.content.indexOf(sectionName) == -1)
#        sectionTable = sectionName + ' - '
#
#    if TSRR.Tables.Config.currentTable
#      tableName = TSRR.Tables.Config.currentTable.get('name')
#      if (me.content.indexOf(tableName) == -1)
#        sectionTable = sectionTable + tableName
#
#    me.setContent sectionTable
#
#    return
#
#
#  currentTableSet: (inEvent, inParam)->
#    @renderData()
#    return
#
#  orderChanged: () ->
#    @renderData()
#    return
#
#
#
#
