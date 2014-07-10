OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "send"
  label: "Send"
  classButtonActive: "btnactive-blue"

enyo.kind
  name: "TSRR.Model.SendModel"
  order: null
  message: null
  printCode: null
  printerProperty: null
  productQty: null
  description: null

enyo.kind
  name: "TSRR.UI.SendButton"
  kbd: null
  sendModel: null
  printCode: null
  printerProperty: null
  product: null
  stateless: true
  action: (keyboard, txt) ->
    kbd = undefined
    sendModel = undefined
    templatereceipt = undefined
    sendModel = undefined
    templatereceipt = undefined
    kbd = keyboard
    window.asdf = keyboard
    new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
      product: keyboard.line.attributes.product.id
    , (data) ->
      if data[0]
        window.asdf = keyboard
        sendModel = new TSRR.Model.SendModel(
          order: keyboard.receipt
          message: "Send this item"
          printCode: data[0].printCode
          printerProperty: data[0].printerProperty
          productQty: String(kbd.line.attributes.qty)
          description: keyboard.line.attributes.description
        )
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.SendTemplate)
        OB.POS.hwserver.print templatereceipt,
          order: sendModel
        OB.UTIL.showSuccess "Line sent"
        enyo.Signals.send "onTransmission", {message: 'send', cid: keyboard.line.cid}

      else
        OB.UTIL.showError "No printer is assigned to this product"
        console.log "no data found"


OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "send", new TSRR.UI.SendButton()