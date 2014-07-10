OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "cancel"
  label: "Cancel"
  classButtonActive: "btnactive-blue"

enyo.kind
  name: "TSRR.Model.CancelModel"
  order: null
  message: null
  printCode: null
  printerProperty: null
  productQty: null
  description: null

enyo.kind
  name: "TSRR.UI.CancelButton"
  kbd: null
  cancelModel: null
  printCode: null
  printerProperty: null
  product: null
  stateless: true
  action: (keyboard, txt) ->
    cancelModel = undefined
    kbd = undefined
    templatereceipt = undefined
    cancelModel = undefined
    templatereceipt = undefined
    kbd = keyboard
    new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
      product: keyboard.line.attributes.product.id
    , (data) ->
      if data[0]
        cancelModel = new TSRR.Model.CancelModel(
          order: keyboard.receipt
          message: "Cancel this item"
          printCode: data[0].printCode
          printerProperty: data[0].printerProperty
          productQty: String(kbd.line.attributes.qty)
          description: keyboard.line.attributes.description
        )
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.CancelTemplate)
        OB.POS.hwserver.print templatereceipt,
          order: cancelModel
        OB.UTIL.showSuccess "Line cancelled"
        enyo.Signals.send "onTransmission", {message: 'cancel', cid: keyboard.line.cid}

      else
        OB.UTIL.showError "No printer is assigned to this product"
        console.log "no data found"


OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "cancel", new TSRR.UI.CancelButton()