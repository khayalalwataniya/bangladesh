#global enyo, _, $

enyo.kind
  kind: "OB.UI.SelectButton"
  name: "OB.UI.RenderOrderLine"
  classes: "btnselect-orderline"
  handlers:
    onChangeEditMode: "changeEditMode"
    onCheckBoxBehaviorForTicketLine: "checkBoxForTicketLines"

  events:
    onLineChecked: ""

  components: [
    name: "checkBoxColumn"
    kind: "OB.UI.CheckboxButton"
    tag: "div"
    style: "float: left; width: 10%;"
  ,
    name: "product"
    attributes:
      style: "float: left; width: 40%;"
  ,
    name: "quantity"
    attributes:
      style: "float: left; width: 10%; text-align: right;"
  ,
    name: "price"
    attributes:
      style: "float: left; width: 15%; text-align: right;"
  ,
    name: "gross"
    attributes:
      style: "float: left; width: 15%; text-align: right;"
  ,
    name: "sendstatus"
    attributes:
      style: "float: left; width: 20%; text-align: right;"
  ,
    kind: "Signals"
    onTransmission: "transmission"
  ,
    style: "clear: both;"
  ]
  initComponents: ->
    me = @
    @inherited arguments
    @$.checkBoxColumn.hide()
    @$.product.setContent @model.get("product").get("_identifier")
    @$.quantity.setContent @model.printQty()
    @$.price.setContent @model.printPrice()
    if @model.get("priceIncludesTax")
      @$.gross.setContent @model.printGross()
    else
      @$.gross.setContent @model.printNet()
    if @model.get("product").get("characteristicDescription")
      window.prd = @model.get("product")
      @createComponent
        style: "display: block;"
        components: [
          content: @model.get("product").get("characteristicDescription")
#					content: OB.UTIL.getCharacteristicValues(@model.get("product").get("characteristicDescription"))
          attributes:
            style: "float: left; width: 60%; color:grey"
        ,
          style: "clear: both;"
        ]

    unless @model.cid is null
      if window.localStorage.getItem(@model.cid) is null
        console.log @model.cid
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
            content: "-- " + d.name
            attributes:
              style: "float: left; width: 80%;"
          ,
            content: OB.I18N.formatCurrency(-d.amt)
            attributes:
              style: "float: right; width: 20%; text-align: right;"
          ,
            style: "clear: both;"
          ]

      ), this
    OB.MobileApp.model.hookManager.executeHooks "OBPOS_RenderOrderLine",
      orderline: this
    , (args) ->

  transmission: (inSender, inPayload) ->
    @inherited arguments
    if @model.cid == inPayload.cid
      @container.children[0].controls[5].setContent inPayload.message
      localStorage.setItem inPayload.cid, inPayload.message


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

enyo.kind
  name: "OB.UI.RenderOrderLineEmpty"
  style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc"
  initComponents: ->
    @inherited arguments
    @setContent OB.I18N.getLabel("OBPOS_ReceiptNew")

enyo.kind
  name: "OB.UI.RenderTaxLineEmpty"
  style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc"
  initComponents: ->
    @inherited arguments

enyo.kind
  kind: "OB.UI.SelectButton"
  name: "OB.UI.RenderTaxLine"
  classes: "btnselect-orderline"
  tap: ->
    console.log @name
  components: [
    name: "tax"
    attributes:
      style: "float: left; width: 60%;"
  ,
    name: "base"
    attributes:
      style: "float: left; width: 20%; text-align: right;"
  ,
    name: "totaltax"
    attributes:
      style: "float: left; width: 20%; text-align: right;"
  ,
    style: "clear: both;"
  ]
  selected: ->
    console.log @name

  initComponents: ->
    @inherited arguments
    @$.tax.setContent @model.get("name")
    @$.base.setContent OB.I18N.formatCurrency(@model.get("net"))
    @$.totaltax.setContent OB.I18N.formatCurrency(@model.get("amount"))

enyo.kind
  kind: "OB.UI.SelectButton"
  name: "OB.UI.RenderPaymentLine"
  classes: "btnselect-orderline"
  style: "border-bottom: 0px"
  tap: ->
    console.log @name

  components: [
    name: "name"
    attributes:
      style: "float: left; width: 40%; padding: 5px 0px 0px 0px;"
  ,
    name: "date"
    attributes:
      style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
  ,
    name: "foreignAmount"
    attributes:
      style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
  ,
    name: "amount"
    attributes:
      style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
  ,
    style: "clear: both;"
  ]
  selected: ->
    console.log @name

  initComponents: ->
    paymentDate = undefined
    @inherited arguments
    @$.name.setContent OB.POS.modelterminal.getPaymentName(@model.get("kind")) or @model.get("name")
    if OB.UTIL.isNullOrUndefined(@model.get("paymentDate"))
      paymentDate = OB.I18N.formatDate(new Date())
    else
      paymentDate = OB.I18N.formatDate(@model.get("paymentDate"))
    @$.date.setContent paymentDate
    if @model.get("rate") and @model.get("rate") isnt "1"
      @$.foreignAmount.setContent @model.printForeignAmount()
    else
      @$.foreignAmount.setContent ""
    @$.amount.setContent @model.printAmount()

enyo.kind
  name: "OB.UI.RenderPaymentLineEmpty"
  style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc"
  initComponents: ->
    @inherited arguments
