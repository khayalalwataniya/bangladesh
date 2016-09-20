#OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
#  i18nLabel: "TSRR_BtnCancelLineLabel"
#  command: 'line:cancelCommand'
#  classButtonActive: "btnactive-blue"
#  stateless: true
#  definition:
#    stateless: true
#    action: (keyboard, txt) ->
#      OB.UI.printingUtils.prepareReceipt(keyboard)
#      gpi = keyboard.line.attributes.product.attributes.generic_product_id
#      if gpi isnt null
#        OB.UI.printingUtils.printGenericLine(keyboard, gpi,  "Cancel these lines", "cancelled")
#        return
#      else
#        OB.UI.printingUtils.printNonGenericLine(keyboard, "Cancel This Item", "Line cancelled", "cancelled")
#      keyboard.receipt.trigger('scan')
#      return
