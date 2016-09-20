#global enyo, Backbone, _, $
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

OB.UI.RestaurantUtils =
  getCurrentOrder: getCurrentOrder
  getPendingOrders: getPendingOrders
  findProductModel: findProductModel
  getOrderLineById: getOrderLineById
  deleteBookingById: deleteBookingById
  service: service
  getBookingInfoByOrder: getBookingInfoByOrder



