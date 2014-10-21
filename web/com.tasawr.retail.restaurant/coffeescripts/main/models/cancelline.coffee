OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_BtnCancelLineLabel"
  command: 'line:cancelCommand'
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
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelLinesTemplate)
        OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendToPrinter)

        _.each newArray.models, (model)->
          enyo.Signals.send "onTransmission", {message: 'cancelled', cid: model.cid}

        OB.UTIL.showSuccess "Orders sent to printers successfully"
        newArray = null
        keyboard.receipt.trigger('scan')
        return
      else
        new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
          product: keyboard.line.get('product').id
        , (data) ->
          if data[0]
            message = "Cancel this item"
            sendModel = OB.UI.printingUtils.buildModel(keyboard, data, message)
            templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelTemplate)
            OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel)
            enyo.Signals.send "onTransmission", {message: 'cancelled', cid: keyboard.line.cid}
            OB.UTIL.showSuccess "Line Cancelled"
          else
            OB.UTIL.showError "No printer is assigned to this product"

      keyboard.receipt.trigger('scan')
      return

