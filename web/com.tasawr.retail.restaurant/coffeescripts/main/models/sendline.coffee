#OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
#  i18nLabel: "TSRR_BtnSendLineLabel"
#  command: 'line:sendCommand'
#  kind: 'OB.UI.Button'
#  classButtonActive: "btnactive-blue"
#  stateless: true
#  definition:
#    stateless: true
#    action: (keyboard, txt) ->
#      debugger
#      OB.UI.printingUtils.prepareReceipt(keyboard)
#      gpi = keyboard.line.attributes.product.attributes.generic_product_id
#      if gpi isnt null
#        OB.UI.printingUtils.printGenericLine(keyboard, gpi,  "Send these lines", "sent")
#        return
#      else
#        OB.UI.printingUtils.printNonGenericLine(keyboard, "Send This Item", "Line sent", "sent")
#      keyboard.receipt.trigger('scan')
#      return
