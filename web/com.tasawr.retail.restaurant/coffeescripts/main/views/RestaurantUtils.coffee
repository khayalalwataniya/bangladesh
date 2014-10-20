#global enyo, Backbone, _, $

printersAndProducts = []
allPrinters = []
allProducts = []
window.productsAndPrinters = []
requests = []


findProductModel = (id, callback) ->
  OB.Dal.find OB.Model.Product,
    id: id
  , (successCallbackProducts = (dataProducts) ->
      if dataProducts and dataProducts.length > 0
        callback dataProducts.at(0)
      else
        callback null
      return
    ), errorCallback = (tx, error) ->
      OB.UTIL.showError "OBDAL error: " + error
      callback null
      return

  return

deleteBookingById = (bid, callback) ->
  $.ajax "../../org.openbravo.service.json.jsonrest/TSRR_BookingInfo/" + bid,
    data: null
    type: "DELETE"
    processData: false
    contentType: "application/json"
    success: (resp) ->
      OB.info resp
      callback resp

    callback null


service = (source, method, dataparams, callback, callbackError) ->
  ajaxRequest = new enyo.Ajax(
    url: "/openbravo/org.openbravo.service.json.jsonrest/" + source
    cacheBust: false
    method: method
    handleAs: "json"
    contentType: "application/json;charset=utf-8"
    data: dataparams
    success: (inSender, inResponse) ->
      response = inResponse.response
      status = response.status
      if status is 0
        callback response.data
      else if response.errors
        callbackError exception:
          message: response.errors.id

      else
        callbackError exception:
          message: response.error.message

      return

    fail: (inSender, inResponse) ->
      callbackError exception:
        message: OB.I18N.getLabel("OBPOS_MsgApplicationServerNotAvailable")
        status: inResponse

      return
  )
  ajaxRequest.go(ajaxRequest.data).response("success").error "fail"
  return

#TSRR.Tables.Config.currentOrderId
getCurrentOrder = (orderId, callback) ->
  criteria =
    hasbeenpaid: "N"
    session: OB.POS.modelterminal.get("session")

  OB.Dal.find OB.Model.Order, criteria, ((ordersNotPaid) -> #OB.Dal.find success
    if ordersNotPaid and ordersNotPaid.length > 0
      for ord in ordersNotPaid
        if (orderId == ord)
          OB.info 'order found in getCurrentOrder with ID: ' + orderId
          return callback ord
    else
      callback null
  ), ->
    #console.log arguments

getBookingInfoByOrder = (orderId, callback) ->
  criteria =
    salesOrder: orderId
  OB.Dal.find OB.Model.BookingInfo, criteria, ((bookingsFound) -> #OB.Dal.find success
    if bookingsFound and bookingsFound.length > 0
      callback bookingsFound.at 0
    else
      callback null
  ), ->
    #console.log arguments

getPendingOrders = (callback) ->
  criteria =
    hasbeenpaid: "N"
    session: OB.POS.modelterminal.get("session")

  OB.Dal.find OB.Model.Order, criteria, ((ordersNotPaid) -> #OB.Dal.find success
    if ordersNotPaid and ordersNotPaid.length > 0
      callback ordersNotPaid
    else
      callback null
  ), ->
    #console.log arguments

getOrderLineById = (id, callback) ->
  criteria =
    id: id
    session: OB.POS.modelterminal.get("session")

  OB.Dal.find OB.Model.OrderLine, criteria, ((lineItem) -> #OB.Dal.find success
    if lineItem and lineItem.length > 0
      callback lineItem
    else
      callback null
  ), ->
    #console.log arguments






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




OB.UI.RestaurantUtils =
  getCurrentOrder: getCurrentOrder
  getPendingOrders: getPendingOrders
  findProductModel: findProductModel
  getOrderLineById: getOrderLineById
  deleteBookingById: deleteBookingById
  service: service
  getBookingInfoByOrder: getBookingInfoByOrder
  uniquePrinterAndProductGenerator: uniquePrinterAndProductGenerator
  productInfoGetter:productInfoGetter
  assignVar:assignVar

