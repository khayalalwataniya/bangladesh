#OrderLine = Backbone.Model.extend(
#  modelName: "OrderLine"
#  defaults:
#    product: null
#    productidentifier: null
#    uOM: null
#    qty: OB.DEC.Zero
#    price: OB.DEC.Zero
#    priceList: OB.DEC.Zero
#    gross: OB.DEC.Zero
#    net: OB.DEC.Zero
#    description: ""
#    status: "Not Sent"
#
#  initialize: (attributes) ->
#    debugger
#    if attributes and attributes.product
#      @set "product", new OB.Model.Product(attributes.product)
#      @set "productidentifier", attributes.productidentifier
#      @set "uOM", attributes.uOM
#      @set "qty", attributes.qty
#      @set "price", attributes.price
#      @set "priceList", attributes.priceList
#      @set "gross", attributes.gross
#      @set "net", attributes.net
#      @set "status", attributes.status if status
#      @set "promotions", attributes.promotions
#      @set "priceIncludesTax", attributes.priceIncludesTax
#      @set "grossListPrice", attributes.product.listPrice  if not attributes.grossListPrice and attributes.product and attributes.product.listPrice
#    return
#
#  getQty: ->
#    @get "qty"
#
#  printQty: ->
#    @get("qty").toString()
#
#  printPrice: ->
#    OB.I18N.formatCurrency @get("_price") or @get("nondiscountedprice") or @get("price")
#
#  printDiscount: ->
#    disc = OB.DEC.sub(@get("product").get("standardPrice"), @get("price"))
#    prom = @getTotalAmountOfPromotions()
#
#    # if there is a discount no promotion then only discount no promotion is shown
#    # if there is not a discount no promotion and there is a promotion then promotion is shown
#    if OB.DEC.compare(disc) is 0
#      if OB.DEC.compare(prom) is 0
#        ""
#      else
#        OB.I18N.formatCurrency prom
#    else
#      OB.I18N.formatCurrency disc
#
#
## returns the discount to substract in total
#  discountInTotal: ->
#    disc = OB.DEC.sub(@get("product").get("standardPrice"), @get("price"))
#
#    # if there is a discount no promotion then total is price*qty
#    # otherwise total is price*qty - discount
#    if OB.DEC.compare(disc) is 0
#      @getTotalAmountOfPromotions()
#    else
#      0
#
#  calculateGross: ->
#    if @get("priceIncludesTax")
#      @set "gross", OB.DEC.mul(@get("qty"), @get("price"))
#    else
#      @set "net", OB.DEC.mul(@get("qty"), @get("price"))
#    return
#
#  getGross: ->
#    @get "gross"
#
#  getNet: ->
#    @get "net"
#
#  getStatus: ->
#    @get 'status'
#
#  setStatus: (status) ->
#    @set 'status', status
#
#  printGross: ->
#    OB.I18N.formatCurrency @get("_gross") or @getGross()
#
#  printNet: ->
#    OB.I18N.formatCurrency @get("nondiscountednet") or @getNet()
#
#  getTotalAmountOfPromotions: ->
#    memo = 0
#    if @get("promotions") and @get("promotions").length > 0
#      _.reduce @get("promotions"), ((memo, prom) ->
#        return memo  if OB.UTIL.isNullOrUndefined(prom.amt)
#        memo + prom.amt
#      ), memo, this
#    else
#      0
#
#  isAffectedByPack: ->
#    _.find @get("promotions"), ((promotion) ->
#      true  if promotion.pack
#    ), this
#
#  stopApplyingPromotions: ->
#    promotions = @get("promotions")
#    i = undefined
#    if promotions
#
#      # best deal case can only apply one promotion per line
#      return true  if OB.POS.modelterminal.get("terminal").bestDealCase and promotions.length > 0
#      i = 0
#      while i < promotions.length
#        return true  unless promotions[i].applyNext
#        i++
#    false
#
#  lastAppliedPromotion: ->
#    promotions = @get("promotions")
#    i = undefined
#    if @get("promotions")
#      i = 0
#      while i < promotions.length
#        return promotions[i]  if promotions[i].lastApplied
#        i++
#    null
#)
#
#OB.Data.Registry.registerModel OrderLine