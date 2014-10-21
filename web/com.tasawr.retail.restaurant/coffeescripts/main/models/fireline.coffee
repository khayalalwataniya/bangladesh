OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_BtnFireLineLabel"
  command: 'line:fireCommand'
  classButtonActive: "btnactive-blue"
  stateless: true
  definition:
    stateless: true
    action: (keyboard, txt) ->
      OB.UI.printingUtils.prepareReceipt(keyboard)
      gpi = keyboard.line.attributes.product.attributes.generic_product_id
      if gpi isnt null
        OB.UI.printingUtils.printGenericLine(keyboard, gpi,  "Fire these lines")
        return
      else
        OB.UI.printingUtils.printNonGenericLine(keyboard, "Fire This Item", "Line fired", "fired")
      keyboard.receipt.trigger('scan')
      return
