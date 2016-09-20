TSRR.Main.TempVars.printersAndProducts = []
TSRR.Main.TempVars.allPrinters = []
TSRR.Main.TempVars.allProducts = []
TSRR.Main.TempVars.productsAndPrinters = []
TSRR.Main.TempVars.requests = []
TSRR.Main.TempVars.localModels = []


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
  TSRR.Main.TempVars.productsAndPrinters = []
  TSRR.Main.TempVars.printersAndProducts




uniquePrinterAndProductGenerator2 = () ->
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
  TSRR.Main.TempVars.productsAndPrinters = []
  TSRR.Main.TempVars.printersAndProducts

assignVar = (requests, lines) ->
  tempPrinters = []
  i = 0

  while i < requests.length
    result = JSON.parse(requests[i].xhr.responseText)
    data = result.response.data[0]
    console.error 'there '
    console.error data

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

assignVar2 = (collection, lines)->
  
  tempPrinters = []
  i = 0
  while i < collection.length

    data = collection[i].models[0]
    if data
      tempPrinters = data.get('printerProperty').split(" ")
      j = 0
      while j < tempPrinters.length
        TSRR.Main.TempVars.allPrinters.push tempPrinters[j]
        j++
      TSRR.Main.TempVars.productsAndPrinters[i] = []
      TSRR.Main.TempVars.productsAndPrinters[i][0] = data.get('printCode')
      TSRR.Main.TempVars.productsAndPrinters[i][1] = [tempPrinters]
#      TSRR.Main.TempVars.productsAndPrinters[i][2] = lines.models[i].get('qty')
#      TSRR.Main.TempVars.productsAndPrinters[i][3] = lines.models[i].get('description')
      TSRR.Main.TempVars.productsAndPrinters[i][2] = lines._wrapped[i].get('qty')
      TSRR.Main.TempVars.productsAndPrinters[i][3] = lines._wrapped[i].get('description')
    i++


productInfoGetter = (lines) ->
  i = 0
  while i < lines.length
    if i >= lines.models.length
      break
    else
      ajaxRequest = new enyo.Ajax(
        url: "../../org.openbravo.mobile.core.service.jsonrest/" + "com.tasawr.retail.restaurant.data.OrderLineService" + "/" + encodeURI(JSON.stringify({product: lines.models[i].get('product').id, terminal:OB.POS.modelterminal.get('terminal').id}))
        cacheBust: false
        sync: true
        method: "GET"
        beforeSend: (xhr)->
          xhr.setRequestHeader "Authorization", "Basic " + btoa(OB.POS.modelterminal.user + ":" + OB.POS.modelterminal.password)
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


productInfoGetter2 = (lines) ->
  promises = []
  
  for line in lines._wrapped
    promise = findModel(OB.Model.Printprodcode,
      product: line.get("product").id
      pOSTerminal: OB.POS.modelterminal.get("terminal").id
    )
    promises.push promise
  return promises

findModel = (model, params) ->
  deferred = $.Deferred()
  OB.Dal.find model, params, ((data) ->
    deferred.resolve data
  ), (err) ->
    deferred.reject err
  deferred.promise()

prepareReceipt =  (keyboard) ->

  if typeof(keyboard.receipt.attributes.numberOfGuests) is "undefined"
    keyboard.receipt.attributes.numberOfGuests = "Unspecified"
  if typeof(keyboard.receipt.attributes.description) is "undefined"
    console.error 'receipt description not found'




buildModel = (keyboard, data, message) ->
  new TSRR.Main.Model.GenericModelForPrinter
    order: keyboard.receipt
    message: message
    printCode: data[0].printCode
    printerProperty: data[0].printerProperty
    productQty: String(keyboard.line.get('qty'))
    description: keyboard.line.get('description')


buildModel2 = (keyboard, data, message) ->
  new TSRR.Main.Model.GenericModelForPrinter
    order: keyboard.receipt
    message: message
    printCode: data.models[0].get('printCode')
    printerProperty: data.models[0].get('printerProperty')
    productQty: String(keyboard.line.get('qty'))
    description: keyboard.line.get('description')



getFilteredLines = (keyboard, gpi) ->

  allLines = keyboard.receipt.get('lines')
  newArray = _(allLines.filter (line) ->
    line.attributes.product.attributes.generic_product_id is gpi)
  newArray

printNonGenericLine = (keyboard, messageParam, successMessage, lineMessage) ->
  OB.Dal.find OB.Model.Printprodcode,
    product: keyboard.line.get('product').id
    pOSTerminal: OB.POS.modelterminal.get('terminal').id
  , ((model)->
      if model.models[0]
        sendModel = OB.UI.printingUtils.buildModel2(keyboard, model, messageParam)
        templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.NonGenericLineTemplate)
        OB.UI.printingUtils.printLineOrReceipt(keyboard, templatereceipt, sendModel)
        enyo.Signals.send "onTransmission", {message: lineMessage, keyboard: keyboard}
        OB.UTIL.showSuccess successMessage
      else
        OB.UTIL.showError "No printer is assigned to this product"

    ), ->
      console.error "error"
      return
    return


printGenericLine = (keyboard, gpi, message, statusMessage) ->

  
  newArray = OB.UI.printingUtils.getFilteredLines(keyboard, gpi)
  TSRR.Main.TempVars.productsAndPrinters = []
  promises = OB.UI.printingUtils.productInfoGetter2(newArray)
  $.when.apply(`undefined`, promises).then ((models...) ->
    assignVar2(models, newArray)
    sendToPrinter = uniquePrinterAndProductGenerator2()
    templatereceipt = new OB.DS.HWResource(OB.OBPOSPointOfSale.Print.GenericLineTemplate)
    OB.POS.hwserver.print templatereceipt,
      order: sendToPrinter
      receiptNo: keyboard.receipt.get('documentNo')
      tableNo: JSON.parse(localStorage.getItem('currentTable')).name
      sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
      guestNo: keyboard.receipt.get('numberOfGuests')
      message: message
      user: keyboard.receipt.get('salesRepresentative$_identifier')

    _.each newArray._wrapped, (model)->
      
      model.set('sendstatus', statusMessage)
      model.trigger('change')
    keyboard.receipt.save()

    OB.UTIL.showSuccess "Orders sent to printers successfully"
    newArray = null
    keyboard.receipt.trigger('scan')

  )



printLineOrReceipt = (keyboard, templatereceipt, sendToPrinter) ->
  OB.POS.hwserver.print templatereceipt,
    order: sendToPrinter
    receiptNo: keyboard.receipt.get('documentNo')
    tableNo: JSON.parse(localStorage.getItem('currentTable')).name
    sectionNo: JSON.parse(localStorage.getItem('currentSection')).name
    guestNo: keyboard.receipt.get('numberOfGuests')
    user: keyboard.receipt.get('salesRepresentative$_identifier')


filterAlreadySent =  (lines)->
  filteredLines = _(lines.models.filter (line) ->
    line.attributes.sendstatus is "Not Sent")






OB.UI.printingUtils =
  filterAlreadySent: filterAlreadySent
  uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator
  productInfoGetter:productInfoGetter
  productInfoGetter2:productInfoGetter2
  assignVar:assignVar
  assignVar2: assignVar2
  prepareReceipt: prepareReceipt
  printGenericLine: printGenericLine
  buildModel: buildModel
  getFilteredLines:getFilteredLines
  printNonGenericLine:printNonGenericLine
  printLineOrReceipt:printLineOrReceipt
  buildModel2: buildModel2

  uniquePrinterAndProductGenerator2: uniquePrinterAndProductGenerator2