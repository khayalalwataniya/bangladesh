window.keyboard = ''
uniquePrinterAndProductGenerator = (callback, lines) ->
  callback lines
  qty = undefined
  description = undefined
  uniquePrinters = allPrinters.filter((elem, pos) ->
    allPrinters.indexOf(elem) is pos
  )
  window.arr = productsAndPrinters
  j = 0

  while j < uniquePrinters.length
    prodQtyDesc = new Array()
    tempProducts = new Array()
    i = 0

    while i < productsAndPrinters.length
      if ($.inArray(uniquePrinters[j], productsAndPrinters[i][1][0])) >= 0
        prodQtyDesc.push productsAndPrinters[i]

      i++
    printersAndProducts[j] = []
    printersAndProducts[j][0] = uniquePrinters[j]
    printersAndProducts[j][1] = prodQtyDesc
    j++
  printersAndProducts

assignVar = (requests, lines) ->
  tempPrinters = []
  i = 0

  while i < requests.length
    result = JSON.parse(requests[i].xhr.responseText)
    data = result.response.data[0]
    if data
      tempPrinters = data.printerProperty.split(" ")
      j = 0

      while j < tempPrinters.length
        allPrinters.push tempPrinters[j]
        j++
      productsAndPrinters[i] = []
      productsAndPrinters[i][0] = data.printCode
      productsAndPrinters[i][1] = [tempPrinters]
      productsAndPrinters[i][2] = lines.models[i].attributes.qty
      productsAndPrinters[i][3] = lines.models[i].attributes.description

    i++

productInfoGetter = (lines) ->
  i = 0

  while i < lines.length
    ajaxRequest = new enyo.Ajax(
      url: "../../org.openbravo.mobile.core.service.jsonrest/" + "com.tasawr.retail.restaurant.data.OrderLineService" + "/" + encodeURI(JSON.stringify(product: lines.models[i].attributes.product.id))
      cacheBust: false
      sync: true
      method: "GET"
      handleAs: "json"
      contentType: "application/json;charset=utf-8"
      success: (inSender, inResponse) ->
        fail: (inSender, inResponse) ->
          console.log "failed"
    )
    ajaxRequest.go().response("success").error "fail"
    requests.push ajaxRequest
    i++
  $.when.apply(`undefined`, requests).then assignVar(requests, lines)
  requests.length = 0

printersAndProducts = []
allPrinters = []
allProducts = []
productsAndPrinters = []
requests = []

OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "orderPopup"
  label: "Orders"
  classButtonActive: "btnactive-blue"

enyo.kind
  name: "TSRR.UI.SendCancelOrderPopup"
  kind: "OB.UI.ModalAction"
  i18nHeader: "TSRR_SendCancelOrderPopupHeaderMessage"
  handlers:
    onSendButton: "sendButton"
    onCancelButton: "cancelButton"

  events:
    onShowPopup: ""

  bodyContent:
    kind: "Scroller"
    maxHeight: "225px"
    style: "background-color: #ffffff;"
    thumb: true
    horizontal: "hidden"
    components: [
      name: "attributes"
    ]

  bodyButtons:
    components: [
      kind: "TSRR.UI.DialogSendButton"
      name: "sendButton"
    ,
      kind: "TSRR.UI.DialogCancelButton"
      name: "cancelButton"
    ]

  loadValue: (mProperty) ->
    @waterfall "onLoadValue",
      model: @model
      modelProperty: mProperty


  sendButton: (inSender, inEvent) ->
    @hide()
    lines = @args.keyboard.receipt.attributes.lines
    sendToPrinter = uniquePrinterAndProductGenerator(productInfoGetter, lines)
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate)
    OB.POS.hwserver.print templatereceipt,
      order: sendToPrinter
      receiptNo: @args.keyboard.receipt.attributes.documentNo
      tableNo: @args.keyboard.receipt.attributes.restaurantTable.name
      guestNo: @args.keyboard.receipt.attributes.numberOfGuests
      user: @args.keyboard.receipt.attributes.salesRepresentative$_identifier

    _.each lines.models, (model)->
      enyo.Signals.send "onTransmission", {message: 'sent', cid: model.cid}

    OB.UTIL.showSuccess "Orders sent to printers successfully"


  cancelButton: (keyboard, inEvent) ->
    @hide()
    @doShowPopup
      popup: "TSRR_UI_CancelOrderReasonPopup"
      args:
        message: ""
        keyboard: keyboard


  executeOnHide: ->
    console.log 'executeOnHide'

  executeOnShow: ->
    console.log 'executeOnShow'

  applyChanges: (inSender, inEvent) ->
    @waterfall "onApplyChange", {}
    true

  initComponents: ->
    @inherited arguments


enyo.kind
  name: "TSRR.UI.DialogSendButton"
  kind: "OB.UI.ModalDialogButton"
  style: "color: black; background-color: white;"
  isDefaultAction: true
  events:
    onHideThisPopup: ""
    onSendButton: ""

  tap: (inSender, inEvent) ->
    @doSendButton()

  initComponents: ->
    @inherited arguments
    @setContent "Send"

enyo.kind
  name: "TSRR.UI.DialogCancelButton"
  kind: "OB.UI.ModalDialogButton"
  style: "color: black; background-color: white;"
  isDefaultAction: true
  events:
    onHideThisPopup: ""
    onCancelButton: ""

  tap: ->
    @doCancelButton()

  initComponents: ->
    @inherited arguments
    @setContent "Cancel"

enyo.kind
  name: "TSRR.UI.OrderButton"
  stateless: true
  action: (keyboard, txt) ->
    window.keyboard = keyboard
    keyboard.doShowPopup
      popup: "TSRR_UI_SendCancelOrderPopup"
      args:
        message: ""
        keyboard: keyboard


OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "orderPopup", new TSRR.UI.OrderButton()

OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
  kind: "TSRR.UI.SendCancelOrderPopup"
  name: "TSRR_UI_SendCancelOrderPopup"


enyo.kind
  kind: "OB.UI.ModalAction"
  name: "TSRR.UI.CancelOrderReasonPopup"
  i18nHeader: "TSRR_CancelReasonHeader"

  handlers:
    onCancelReasonOkButton: "okButtonPressed"
    onCancelReasonCancelButton: "cancelButtonPressed"


  published:
    message: ''

  bodyContent:
    components: [
      {kind: "onyx.Input", placeholder: "Enter reason here", onchange: "okButtonPressed", classes: "modal-dialog-receipt-properties-text", name: "cancelReasonText"},
      {name: "result", classes: "onyx-sample-result", content: "No input entered yet."}
    ]

  bodyButtons:
    components: [
      kind: "TSRR.UI.CancelReasonOkButton"
      name: "cancelReasonOkButton"
    ,
      kind: "TSRR.UI.CancelReasonCancelButton"
      name: "cancelReasonCancelButton"
    ]

  okButtonPressed: (inSender, inEvent) ->
    @inherited arguments

    @message = inSender.getControls()[0].getControls()[0].getControls()[0].getValue()
    lines = window.keyboard.receipt.attributes.lines
    sendToPrinter = uniquePrinterAndProductGenerator(productInfoGetter, lines)
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelOrderTemplate)
    
    OB.POS.hwserver.print templatereceipt,
      order: sendToPrinter
      message: @message
      receiptNo: @parent.model.attributes.order.attributes.documentNo
      tableNo: @parent.model.attributes.order.attributes.restaurantTable.name
      guestNo: @parent.model.attributes.order.attributes.numberOfGuests
      user: @parent.model.attributes.order.attributes.salesRepresentative$_identifier


    _.each lines.models, (model)->
      enyo.Signals.send "onTransmission", {message: 'cancelled', cid: model.cid}


    OB.UTIL.showSuccess "Order cancelled"
    @parent.$.TSRR_UI_SendCancelOrderPopup.hide()
    @hide()

  cancelButtonPressed: (inSender, inEvent) ->
    @parent.$.TSRR_UI_SendCancelOrderPopup.hide()
    @hide()

#	executeOnHide: ->
#	executeOnShow: ->
  init: (model) ->
    window.model = model
    @inherited arguments
    console.log model


enyo.kind
  name: "TSRR.UI.CancelReasonOkButton"
  kind: "OB.UI.ModalDialogButton"
  style: "color: black; background-color: white;"
  isDefaultAction: true
  events:
    onCancelReasonOkButton: ""

  tap: (inSender, inEvent) ->
    @doCancelReasonOkButton()

  initComponents: ->
    @inherited arguments
    @setContent "Ok"

enyo.kind
  name: "TSRR.UI.CancelReasonCancelButton"
  kind: "OB.UI.ModalDialogButton"
  style: "color: black; background-color: white;"
  isDefaultAction: true
  events:
    onCancelReasonCancelButton: ""

  tap: (inSender, inEvent) ->
    @doCancelReasonCancelButton()


  initComponents: ->
    @inherited arguments
    @setContent "Cancel"


OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
  kind: "TSRR.UI.CancelOrderReasonPopup"
  name: "TSRR_UI_CancelOrderReasonPopup"
