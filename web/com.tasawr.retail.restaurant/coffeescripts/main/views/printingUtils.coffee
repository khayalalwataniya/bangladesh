TSRR.Main.TempVars.printersAndProducts = []
TSRR.Main.TempVars.allPrinters = []
TSRR.Main.TempVars.allProducts = []
TSRR.Main.TempVars.productsAndPrinters = []
TSRR.Main.TempVars.requests = []


uniquePrinterAndProductGenerator = (callback, lines) ->
  callback lines

  qty = undefined
  description = undefined
  uniquePrinters = TSRR.Main.TempVars.allPrinters.filter((elem, pos) ->
    TSRR.Main.TempVars.allPrinters.indexOf(elem) is pos
  )
  j = 0

  while j < uniquePrinters.length
    prodQtyDesc = new Array()
    tempProducts = new Array()
    i = 0

    while i < TSRR.Main.TempVars.productsAndPrinters.length
      if ($.inArray(uniquePrinters[j], TSRR.Main.TempVars.productsAndPrinters[i][1][0])) >= 0
        prodQtyDesc.push TSRR.Main.TempVars.productsAndPrinters[i]

      i++
    TSRR.Main.TempVars.printersAndProducts[j] = []
    TSRR.Main.TempVars.printersAndProducts[j][0] = uniquePrinters[j]
    TSRR.Main.TempVars.printersAndProducts[j][1] = prodQtyDesc
    j++

  TSRR.Main.TempVars.printersAndProducts

assignVar = (requests, lines) ->
  tempPrinters = []
  i = 0

  while i < requests.length
    result = JSON.parse(requests[i].xhr.responseText)
    data = result.response.data[0]
    if data
      tempPrinters = data.printerProperty.split(" ")
      j = 0

      while j < tempPrinters.length
        TSRR.Main.TempVars.allPrinters.push tempPrinters[j]
        j++
      TSRR.Main.TempVars.productsAndPrinters[i] = []
      TSRR.Main.TempVars.productsAndPrinters[i][0] = data.printCode
      TSRR.Main.TempVars.productsAndPrinters[i][1] = [tempPrinters]
      TSRR.Main.TempVars.productsAndPrinters[i][2] = lines.models[i].get('qty')
      TSRR.Main.TempVars.productsAndPrinters[i][3] = lines.models[i].get('description')

    i++

productInfoGetter = (lines) ->
  i = 0


  while i < lines.length
    if i >= lines.models.length
      break
    else
      ajaxRequest = new enyo.Ajax(
        url: "../../org.openbravo.mobile.core.service.jsonrest/" + "com.tasawr.retail.restaurant.data.OrderLineService" + "/" + encodeURI(JSON.stringify(product: lines.models[i].get('product').id))
        cacheBust: false
        sync: true
        method: "GET"
        handleAs: "json"
        contentType: "application/json;charset=utf-8"
        success: (inSender, inResponse) ->
          fail: (inSender, inResponse) ->
            console.log "failed"
      )
      ajaxRequest.go().response("success").error "fail"
      TSRR.Main.TempVars.requests.push ajaxRequest
    i++
  $.when.apply(`undefined`, TSRR.Main.TempVars.requests).then assignVar(TSRR.Main.TempVars.requests, lines)
  TSRR.Main.TempVars.requests.length = 0



prepareReceipt =  (keyboard) ->

  if keyboard.receipt.attributes.resaurantTable.attributes.name is null or undefined
    keyboard.receipt.attributes.resaurantTable.attributes.name = "Unspecified"
  if keyboard.receipt.attributes.numberOfGuests is null or undefined
      keyboard.receipt.attributes.numberOfGuests = "Unspecified"
  if keyboard.receipt.attributes.description is null or undefined
    console.error 'asdf'




buildModel = (keyboard, data, message) ->
  new TSRR.Main.Model.GenericModelForPrinter
    order: keyboard.receipt
    message: message
    printCode: data[0].printCode
    printerProperty: data[0].printerProperty
    productQty: String(keyboard.line.get('qty'))
    description: keyboard.line.get('description')



getFilteredLines = (keyboard, gpi) ->
  allLines = keyboard.receipt.get('lines')
  newArray = jQuery.extend(true, {}, keyboard.receipt.get('lines'));
  for line in allLines.models
    if line.get('product').get('generic_product_id') is gpi
      console.info 'present'
    else
      newArray.models.splice(newArray.models.indexOf(line), 1);

  newArray

printNonGenericLine = (keyboard, messageParam, successMessage, lineMessage) ->
  new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
    product: keyboard.line.get('product').id
  , (data) ->
    if data[0]
      message = messageParam
      sendModel = OB.UI.printingUtils.buildModel(keyboard, data, message)
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.NonGenericLineTemplate)
      OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel)
      enyo.Signals.send "onTransmission", {message: lineMessage, cid: keyboard.line.cid}
      OB.UTIL.showSuccess successMessage
    else
      OB.UTIL.showError "No printer is assigned to this product"


printGenericLine = (keyboard, gpi, message, statusMessage) ->

  newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi)
  TSRR.Main.TempVars.productsAndPrinters = []
  sendToPrinter = OB.UI.printingUtils.uniquePrinterAndProductGenerator(OB.UI.printingUtils.productInfoGetter, newArray)
  templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.GenericLineTemplate)

  OB.POS.hwserver.print templatereceipt,
    order: sendToPrinter
    receiptNo: keyboard.receipt.get('documentNo')
    tableNo: keyboard.receipt.get('restaurantTable').name
    sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
    guestNo: keyboard.receipt.get('numberOfGuests')
    message: message
    user: keyboard.receipt.get('salesRepresentative$_identifier')

  _.each newArray.models, (model)->
    enyo.Signals.send "onTransmission", {message: statusMessage, cid: model.cid}

  OB.UTIL.showSuccess "Orders sent to printers successfully"
  newArray = null
  keyboard.receipt.trigger('scan')



printLineOrReceipt = (keyboard, templatereceipt, sendToPrinter) ->
  OB.POS.hwserver.print templatereceipt,
    order: sendToPrinter
    receiptNo: keyboard.receipt.get('documentNo')
    tableNo: keyboard.receipt.get('restaurantTable').name
    sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
    guestNo: keyboard.receipt.get('numberOfGuests')
    user: keyboard.receipt.get('salesRepresentative$_identifier')



OB.UI.printingUtils =
  uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator
  productInfoGetter:productInfoGetter
  assignVar:assignVar
  prepareReceipt: prepareReceipt
  printGenericLine: printGenericLine
  buildModel: buildModel
  getFilteredLines:getFilteredLines
  printNonGenericLine:printNonGenericLine
  printLineOrReceipt:printLineOrReceipt