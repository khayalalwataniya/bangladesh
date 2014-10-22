OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "orderPopup"
  i18nLabel: "TSRR_BtnSendAllOrderLabel"
  classButtonActive: "btnactive-blue"
  definition:
    stateless: true
    action: (keyboard, txt) ->
      keyboard.doShowPopup
        popup: "TSRR_UI_SendCancelOrderPopup"
        args:
          message: ""
          keyboard: keyboard
      return


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
    i18nContent: 'TSRR_SendCancelOrderPopupBodyMessage'

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

    OB.UI.printingUtils.prepareReceipt(@args.keyboard)
    lines = @args.keyboard.receipt.attributes.lines
    sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, lines)
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate)
    OB.UI.printingUtils.printLineOrReceipt(@args.keyboard, templatereceipt, sendToPrinter)


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

  init: (model) ->
    @model = model

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
    keyboard.doShowPopup
      popup: "TSRR_UI_SendCancelOrderPopup"
      args:
        message: ""
        keyboard: keyboard


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
    keyboard: null

  bodyContent:
    components: [
      kind: "onyx.Input",
      placeholder: "Enter reason here",
      onchange: "okButtonPressed",
      classes: "modal-dialog-receipt-properties-text",
      name: "cancelReasonText"
    ,
      name: "result"
      classes: "onyx-result"
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
    lines = TSRR.Tables.Config.currentOrder.get('lines')
    sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, lines)
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelOrderTemplate)

    OB.POS.hwserver.print templatereceipt,
      order: sendToPrinter
      message: @message
      receiptNo: @parent.model.get('order').get('documentNo')
      tableNo: @parent.model.get('order').get('restaurantTable').name
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
      guestNo: @parent.model.get('order').get('numberOfGuests')
      user: @parent.model.get('order').get('salesRepresentative$_identifier')


    _.each lines.models, (model)->
      enyo.Signals.send "onTransmission", {message: 'cancelled', cid: model.cid}


    OB.UTIL.showSuccess "Order cancelled"
    @parent.$.TSRR_UI_SendCancelOrderPopup.hide()
    @hide()

  cancelButtonPressed: (inSender, inEvent) ->
    @parent.$.TSRR_UI_SendCancelOrderPopup.hide()
    @hide()

  init: (model) ->
    @inherited arguments
    window.model = model


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
    @setContent OB.I18N.getLabel("OBMOBC_LblOk")

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
    @setContent OB.I18N.getLabel("OBMOBC_LblCancel")


OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
  kind: "TSRR.UI.CancelOrderReasonPopup"
  name: "TSRR_UI_CancelOrderReasonPopup"
