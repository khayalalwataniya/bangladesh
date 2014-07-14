OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  command: "hold"
  label: "Hold"
  classButtonActive: "btnactive-blue"

enyo.kind
  name: "TSRR.Model.HoldModel"
  order: null
  message: null
  printCode: null
  printerProperty: null
  productQty: null
  description: null

enyo.kind
  name: "TSRR.UI.HoldButton"
  kbd: null
  holdModel: null
  printCode: null
  printerProperty: null
  product: null
  stateless: true
  action: (keyboard, txt) ->
    window.x = keyboard
    console.log keyboard
    holdModel = undefined
    kbd = undefined
    templatereceipt = undefined
    kbd = keyboard
    new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
      product: keyboard.line.attributes.product.id
    , (data) ->
      if data[0]
        holdModel = new TSRR.Model.HoldModel(
          order: keyboard.receipt
          message: "Hold this item"
          printCode: data[0].printCode
          printerProperty: data[0].printerProperty
          productQty: String(kbd.line.attributes.qty)
          description: keyboard.line.attributes.description
        )
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.HoldTemplate)
        OB.POS.hwserver.print templatereceipt,
          order: holdModel

        OB.UTIL.showSuccess "Line on hold"
        enyo.Signals.send "onTransmission", {message: 'held', cid: keyboard.line.cid}

      else
        OB.UTIL.showError "No printer is assigned to this product"
        console.log "no data found"


OB.OBPOSPointOfSale.UI.KeyboardOrder::addCommand "hold", new TSRR.UI.HoldButton()