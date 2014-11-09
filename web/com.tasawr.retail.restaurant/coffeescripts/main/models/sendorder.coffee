OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "sendOrder"
  i18nLabel: "TSRR_BtnSendAllOrderLabel"
  classButtonActive: "btnactive-blue"
  definition:
    stateless: true
    action: (keyboard, txt) ->
      OB.UI.printingUtils.prepareReceipt(keyboard)
      lines = keyboard.receipt.attributes.lines
      sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, lines)
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendOrderTemplate)
      OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendToPrinter)

      _.each lines.models, (model)->
        enyo.Signals.send "onTransmission", {message: 'sent', cid: model.cid}

      OB.UTIL.showSuccess "Orders sent to printers successfully"

      return


OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "cancelOrderReasonPopup"
  i18nLabel: "TSRR_BtnCancelOrderLabel"
  classButtonActive: "btnactive-blue"
  definition:
    stateless: true
    action: (keyboard, txt) ->
      keyboard.doShowPopup
        popup: "TSRR_UI_CancelOrderReasonPopup"
        args:
          message: ""
          keyboard: keyboard
      return



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
    lines = OB.POS.modelterminal.orderList.modelorder.get('lines')

    sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, lines)
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelOrderTemplate)

    OB.POS.hwserver.print templatereceipt,
      order: sendToPrinter
      message: @message
      receiptNo: @parent.model.get('order').get('documentNo')
      tableNo: JSON.parse(localStorage.getItem('currentTable')).name
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
      guestNo: TSRR.Tables.Config.MyOrderList.modelorder.get('numberOfGuests') or "0"
      user: @parent.model.get('order').get('salesRepresentative$_identifier')


    _.each lines.models, (model)->
      enyo.Signals.send "onTransmission", {message: 'cancelled', cid: model.cid}

    @hide()
    OB.UTIL.showSuccess "Order cancelled"
    return

  cancelButtonPressed: (inSender, inEvent) ->
    @hide()
    return

  init: (model) ->
    @inherited arguments



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
