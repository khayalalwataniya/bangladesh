class HoldModel extends Backbone.Model
  order: null
  message: null
  printCode: null
  printerProperty: null
  productQty: null
  description: null



OB.OBPOSPointOfSale.UI.ToolbarScan.buttons.push
  i18nLabel: "TSRR_BtnHoldLineLabel"
  command: 'line:holdCommand'
  classButtonActive: "btnactive-blue"
  stateless: true
  definition:
    stateless: true
    action: (keyboard, txt) ->
      if keyboard.receipt.get('numberOfGuests') is undefined
        keyboard.receipt.set('numberOfGuests', "1")

      gpi = keyboard.line.attributes.product.attributes.generic_product_id
      if gpi isnt null
        me = @
        allLines = null
        allLines = keyboard.receipt.get('lines')
        newArray = jQuery.extend(true, {}, keyboard.receipt.get('lines'));
        for line in allLines.models
          if line.get('product').get('generic_product_id') is gpi
            console.info 'present'
          else
            newArray.models.splice(newArray.models.indexOf(line), 1);

        window.productsAndPrinters = []

        sendToPrinter = OB.UI.RestaurantUtils.uniquePrinterAndProductGenerator(OB.UI.RestaurantUtils.productInfoGetter, newArray)
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.HoldLinesTemplate)
        if keyboard.receipt.attributes.restaurantTable is undefined
          keyboard.receipt.attributes.restaurantTable.name = "Unspecified"
        if keyboard.receipt.attributes.numberOfGuests is undefined
          keyboard.receipt.attributes.numberOfGuests = "Unspecified"
        OB.POS.hwserver.print templatereceipt,
          order: sendToPrinter
          receiptNo: keyboard.receipt.attributes.documentNo
          tableNo: keyboard.receipt.attributes.restaurantTable.name
          guestNo: keyboard.receipt.attributes.numberOfGuests
          user: keyboard.receipt.attributes.salesRepresentative$_identifier
        _.each newArray.models, (model)->
          enyo.Signals.send "onTransmission", {message: 'held', cid: model.cid}

        OB.UTIL.showSuccess "Orders sent to printers successfully"
        newArray = null
        keyboard.receipt.trigger('scan')
        return
      else
        new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
          product: keyboard.line.get('product').id
        , (data) ->
          if data[0]
            holdModel = new HoldModel
              order: keyboard.receipt
              message: "Hold this item"
              printCode: data[0].printCode
              printerProperty: data[0].printerProperty
              productQty: String(keyboard.line.get('qty'))
              description: keyboard.line.get('description')

            templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.HoldTemplate)
            OB.POS.hwserver.print templatereceipt,
              order: holdModel
              receiptNo: keyboard.receipt.get('documentNo')
              tableNo: keyboard.receipt.get('restaurantTable').name
              guestNo: keyboard.receipt.get('numberOfGuests')
              user: keyboard.receipt.get('salesRepresentative$_identifier')
            enyo.Signals.send "onTransmission", {message: 'held', cid: keyboard.line.cid}
            OB.UTIL.showSuccess "Line on hold"
          else
            OB.UTIL.showError "No printer is assigned to this product"

      keyboard.receipt.trigger('scan')
      return

