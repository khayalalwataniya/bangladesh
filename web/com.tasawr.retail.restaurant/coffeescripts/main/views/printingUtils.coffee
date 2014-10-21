printersAndProducts = []
allPrinters = []
allProducts = []
window.productsAndPrinters = []
requests = []


uniquePrinterAndProductGenerator = (callback, lines) ->
  callback lines

  qty = undefined
  description = undefined
  uniquePrinters = allPrinters.filter((elem, pos) ->
    allPrinters.indexOf(elem) is pos
  )
  j = 0

  while j < uniquePrinters.length
    prodQtyDesc = new Array()
    tempProducts = new Array()
    i = 0

    while i < productsAndPrinters.length
      if ($.inArray(uniquePrinters[j], productsAndPrinters[i][1][0])) >= 0
        prodQtyDesc.push productsAndPrinters[i]

      i++
    printersAndProducts[j] = []
    printersAndProducts[j][0] = uniquePrinters[j]
    printersAndProducts[j][1] = prodQtyDesc
    j++

  printersAndProducts

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
        allPrinters.push tempPrinters[j]
        j++
      productsAndPrinters[i] = []
      productsAndPrinters[i][0] = data.printCode
      productsAndPrinters[i][1] = [tempPrinters]
      productsAndPrinters[i][2] = lines.models[i].attributes.qty
      productsAndPrinters[i][3] = lines.models[i].attributes.description

    i++

productInfoGetter = (lines) ->
  i = 0


  while i < lines.length
    if i >= lines.models.length
      break
    else
      ajaxRequest = new enyo.Ajax(
        url: "../../org.openbravo.mobile.core.service.jsonrest/" + "com.tasawr.retail.restaurant.data.OrderLineService" + "/" + encodeURI(JSON.stringify(product: lines.models[i].attributes.product.id))
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
      requests.push ajaxRequest
    i++
  $.when.apply(`undefined`, requests).then assignVar(requests, lines)
  requests.length = 0



prepareReceipt =  (keyboard) ->
#  debugger
  if keyboard.receipt.attributes.restaurantTable is undefined
    keyboard.receipt.attributes.restaurantTable.name = "Unspecified"
  if keyboard.receipt.attributes.numberOfGuests is undefined
    keyboard.receipt.attributes.numberOfGuests = "Unspecified"

printLineOrReceipt = (keyboard, templatereceipt, sendToPrinter) ->
  OB.POS.hwserver.print templatereceipt,
    order: sendToPrinter
    receiptNo: keyboard.receipt.attributes.documentNo
    tableNo: keyboard.receipt.attributes.restaurantTable.name
    sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
    guestNo: keyboard.receipt.attributes.numberOfGuests
    user: keyboard.receipt.attributes.salesRepresentative$_identifier


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

printNonGenericLine = (keyboard, message, successMessage, lineMessage) ->
  new OB.DS.Request("com.tasawr.retail.restaurant.data.OrderLineService").exec
    product: keyboard.line.get('product').id
  , (data) ->
    if data[0]
      message = message
      sendModel = OB.UI.printingUtils.buildModel(keyboard, data, message)
      templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.GenericLineTemplate)
      OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel)
      enyo.Signals.send "onTransmission", {message: lineMessage, cid: keyboard.line.cid}
      OB.UTIL.showSuccess successMessage
    else
      OB.UTIL.showError "No printer is assigned to this product"




OB.UI.printingUtils =
  uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator
  productInfoGetter:productInfoGetter
  assignVar:assignVar
  prepareReceipt: prepareReceipt
  printLineOrReceipt: printLineOrReceipt
  buildModel: buildModel
  getFilteredLines:getFilteredLines
  printNonGenericLine:printNonGenericLine