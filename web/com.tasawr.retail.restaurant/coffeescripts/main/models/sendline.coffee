OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_BtnSendLineLabel"
  command: 'line:sendCommand'
  classButtonActive: "btnactive-blue"
  stateless: true
  definition:
    stateless: true
    action: (keyboard, txt) ->
      OB.UI.printingUtils.prepareReceipt(keyboard)
      gpi = keyboard.line.attributes.product.attributes.generic_product_id
      if gpi isnt null
        newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi)
        window.productsAndPrinters = []
        sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, newArray)
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendLinesTemplate)
        OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendToPrinter)

        _.each newArray.models, (model)->
          enyo.Signals.send "onTransmission", {message: 'sent', cid: model.cid}

        OB.UTIL.showSuccess "Orders sent to printers successfully"
        newArray = null
        keyboard.receipt.trigger('scan')
        return
      else
        OB.UI.printingUtils.printNonGenericLine(keyboard, "Send This Item", "Line sent", "sent")

      keyboard.receipt.trigger('scan')
      return

