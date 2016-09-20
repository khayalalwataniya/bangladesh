#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.Payment"
#  published:
#    receipt: null
#
#  handlers:
#    onButtonStatusChanged: "buttonStatusChanged"
#
#  buttonStatusChanged: (inSender, inEvent) ->
#    payment = undefined
#    amt = undefined
#    change = undefined
#    pending = undefined
#    isMultiOrders = undefined
#    unless _.isUndefined(inEvent.value.payment)
#      payment = inEvent.value.payment
#      isMultiOrders = @model.isValidMultiOrderState()
#      change = @model.getChange()
#      pending = @model.getPending()
#      unless isMultiOrders
#        @receipt.selectedPayment = payment.payment.searchKey
#      else
#        @model.get("multiOrders").set "selectedPayment", payment.payment.searchKey
#      if not _.isNull(change) and change
#        @$.change.setContent OB.I18N.formatCurrencyWithSymbol(OB.DEC.mul(change, payment.mulrate), payment.symbol, payment.currencySymbolAtTheRight)
#      else @$.totalpending.setContent OB.I18N.formatCurrencyWithSymbol(OB.DEC.mul(pending, payment.mulrate), payment.symbol, payment.currencySymbolAtTheRight)  if not _.isNull(pending) and pending
#
#  components: [
#    style: "background-color: #636363; color: white; height: 200px; margin: 5px; padding: 5px"
#    components: [
#      classes: "row-fluid"
#      components: [classes: "span12"]
#    ,
#      classes: "row-fluid"
#      components: [
#        classes: "span9"
#        components: [
#          style: "padding: 10px 0px 0px 10px; height: 28px;"
#          components: [
#            tag: "span"
#            name: "totalpending"
#            style: "font-size: 24px; font-weight: bold;"
#          ,
#            tag: "span"
#            name: "totalpendinglbl"
#          ,
#            tag: "span"
#            name: "change"
#            style: "font-size: 24px; font-weight: bold;"
#          ,
#            tag: "span"
#            name: "changelbl"
#          ,
#            tag: "span"
#            name: "overpayment"
#            style: "font-size: 24px; font-weight: bold;"
#          ,
#            tag: "span"
#            name: "overpaymentlbl"
#          ,
#            tag: "span"
#            name: "exactlbl"
#          ,
#            tag: "span"
#            name: "donezerolbl"
#          ,
#            name: "creditsalesaction"
#            kind: "OB.OBPOSPointOfSale.UI.CreditButton"
#          ,
#            name: "layawayaction"
#            kind: "OB.OBPOSPointOfSale.UI.LayawayButton"
#            showing: false
#          ]
#        ,
#          style: "overflow:auto; width: 100%;"
#          components: [
#            style: "padding: 5px"
#            components: [
#              style: "margin: 2px 0px 0px 0px; border-bottom: 1px solid #cccccc;"
#            ,
#              kind: "OB.UI.ScrollableTable"
#              scrollAreaMaxHeight: "150px"
#              name: "payments"
#              renderEmpty: enyo.kind(style: "height: 36px")
#              renderLine: "OB.OBPOSPointOfSale.UI.RenderPaymentLine"
#            ,
#              kind: "OB.UI.ScrollableTable"
#              scrollAreaMaxHeight: "150px"
#              name: "multiPayments"
#              showing: false
#              renderEmpty: enyo.kind(style: "height: 36px")
#              renderLine: "OB.OBPOSPointOfSale.UI.RenderPaymentLine"
#            ]
#          ]
#        ]
#      ,
#        classes: "span3"
#        components: [
#          style: "float: right;"
#          name: "doneaction"
#          components: [kind: "OB.OBPOSPointOfSale.UI.DoneButton"]
#        ,
#          style: "float: right;"
#          name: "exactaction"
#          components: [kind: "OB.OBPOSPointOfSale.UI.ExactButton"]
#        ]
#      ]
#    ]
#  ]
#  receiptChanged: ->
#    me = this
#    @$.payments.setCollection @receipt.get("payments")
#    @$.multiPayments.setCollection @model.get("multiOrders").get("payments")
#    @receipt.on "change:payment change:change calculategross change:bp change:gross", (->
#      @updatePending()
#    ), this
#    @model.get("leftColumnViewManager").on "change:currentView", (->
#      unless @model.get("leftColumnViewManager").isMultiOrder()
#        @updatePending()
#      else
#        @updatePendingMultiOrders()
#    ), this
#    @updatePending()
#    @updatePendingMultiOrders()  if @model.get("leftColumnViewManager").isMultiOrder()
#    @receipt.on "change:orderType change:isLayaway change:payment", ((model) ->
#      if @model.get("leftColumnViewManager").isMultiOrder()
#        @$.creditsalesaction.hide()
#        @$.layawayaction.hide()
#        return
#      payment = OB.POS.terminal.terminal.paymentnames[OB.POS.terminal.terminal.get("paymentcash")]
#      if (model.get("orderType") is 2 or (model.get("isLayaway"))) and model.get("orderType") isnt 3 and not model.getPaymentStatus().done
#        @$.creditsalesaction.hide()
#        @$.layawayaction.setContent OB.I18N.getLabel("OBPOS_LblLayaway")
#        @$.layawayaction.show()
#      else if model.get("orderType") is 3
#        @$.creditsalesaction.hide()
#        @$.layawayaction.hide()
#      else
#        @$.layawayaction.hide()
#    ), this
#
#  updatePending: ->
#    return true  if @model.get("leftColumnViewManager").isMultiOrder()
#    paymentstatus = @receipt.getPaymentStatus()
#    symbol = ""
#    rate = OB.DEC.One
#    symbolAtRight = true
#    if not _.isUndefined(@receipt) and not _.isUndefined(OB.POS.terminal.terminal.paymentnames[@receipt.selectedPayment])
#      symbol = OB.POS.terminal.terminal.paymentnames[@receipt.selectedPayment].symbol
#      rate = OB.POS.terminal.terminal.paymentnames[@receipt.selectedPayment].mulrate
#      symbolAtRight = OB.POS.terminal.terminal.paymentnames[@receipt.selectedPayment].currencySymbolAtTheRight
#    if paymentstatus.change
#      @$.change.setContent OB.I18N.formatCurrencyWithSymbol(OB.DEC.mul(@receipt.getChange(), rate), symbol, symbolAtRight)
#      @$.change.show()
#      @$.changelbl.show()
#    else
#      @$.change.hide()
#      @$.changelbl.hide()
#    if paymentstatus.overpayment
#      @$.overpayment.setContent paymentstatus.overpayment
#      @$.overpayment.show()
#      @$.overpaymentlbl.show()
#    else
#      @$.overpayment.hide()
#      @$.overpaymentlbl.hide()
#    if paymentstatus.done
#      @$.totalpending.hide()
#      @$.totalpendinglbl.hide()
#      @$.doneaction.show()
#      @$.creditsalesaction.hide()
#      @$.layawayaction.hide()
#    else
#      @$.totalpending.setContent OB.I18N.formatCurrencyWithSymbol(OB.DEC.mul(@receipt.getPending(), rate), symbol, symbolAtRight)
#      @$.totalpending.show()
#
#      #      if (this.receipt.get('orderType') === 1 || this.receipt.get('orderType') === 3) {
#      if paymentstatus.isNegative or @receipt.get("orderType") is 3
#        @$.totalpendinglbl.setContent OB.I18N.getLabel("OBPOS_ReturnRemaining")
#      else
#        @$.totalpendinglbl.setContent OB.I18N.getLabel("OBPOS_PaymentsRemaining")
#      @$.totalpendinglbl.show()
#      @$.doneaction.hide()
#      if @$.doneButton.drawerpreference
#        @$.doneButton.setContent OB.I18N.getLabel("OBPOS_LblOpen")
#        @$.doneButton.drawerOpened = false
#      if OB.POS.modelterminal.get("terminal").allowpayoncredit and @receipt.get("bp")
#        if (@receipt.get("bp").get("creditLimit") > 0 or @receipt.get("bp").get("creditUsed") < 0 or @receipt.getGross() < 0) and not @$.layawayaction.showing
#          @$.creditsalesaction.show()
#        else
#          @$.creditsalesaction.hide()
#    if paymentstatus.done or @receipt.getGross() is 0
#      @$.exactaction.hide()
#      @$.creditsalesaction.hide()
#      @$.layawayaction.hide()
#    else
#      @$.exactaction.show()
#      if @receipt.get("orderType") is 2 or (@receipt.get("isLayaway") and @receipt.get("orderType") isnt 3)
#        @$.layawayaction.show()
#        @$.exactaction.hide()  unless @receipt.get("isLayaway")
#      else @$.layawayaction.hide()  if @receipt.get("orderType") is 3
#      if OB.POS.modelterminal.get("terminal").allowpayoncredit and @receipt.get("bp")
#        if (@receipt.get("bp").get("creditLimit") > 0 or @receipt.get("bp").get("creditUsed") < 0 or @receipt.getGross() < 0) and not @$.layawayaction.showing
#          @$.creditsalesaction.show()
#        else
#          @$.creditsalesaction.hide()
#    if paymentstatus.done and not paymentstatus.change and not paymentstatus.overpayment
#      if @receipt.getGross() is 0
#        @$.exactlbl.hide()
#        @$.donezerolbl.show()
#      else
#        @$.donezerolbl.hide()
#
#        #        if (this.receipt.get('orderType') === 1 || this.receipt.get('orderType') === 3) {
#        if paymentstatus.isNegative or @receipt.get("orderType") is 3
#          @$.exactlbl.setContent OB.I18N.getLabel("OBPOS_ReturnExact")
#        else
#          @$.exactlbl.setContent OB.I18N.getLabel("OBPOS_PaymentsExact")
#        @$.exactlbl.show()
#    else
#      @$.exactlbl.hide()
#      @$.donezerolbl.hide()
#
#  updatePendingMultiOrders: ->
#    paymentstatus = @model.get("multiOrders")
#    symbol = ""
#    symbolAtRight = true
#    rate = OB.DEC.One
#    selectedPayment = undefined
#    @$.layawayaction.hide()
#    if paymentstatus.get("selectedPayment")
#      selectedPayment = OB.POS.terminal.terminal.paymentnames[paymentstatus.get("selectedPayment")]
#    else
#      selectedPayment = OB.POS.terminal.terminal.paymentnames[OB.POS.modelterminal.get("paymentcash")]
#    unless _.isUndefined(selectedPayment)
#      symbol = selectedPayment.symbol
#      rate = selectedPayment.mulrate
#      symbolAtRight = selectedPayment.currencySymbolAtTheRight
#    if paymentstatus.get("change")
#      @$.change.setContent OB.I18N.formatCurrencyWithSymbol(OB.DEC.mul(paymentstatus.get("change"), rate), symbol, symbolAtRight)
#      @$.change.show()
#      @$.changelbl.show()
#    else
#      @$.change.hide()
#      @$.changelbl.hide()
#
#    #overpayment
#    if OB.DEC.compare(OB.DEC.sub(paymentstatus.get("payment"), paymentstatus.get("total"))) > 0
#      @$.overpayment.setContent OB.I18N.formatCurrency(OB.DEC.sub(paymentstatus.get("payment"), paymentstatus.get("total")))
#      @$.overpayment.show()
#      @$.overpaymentlbl.show()
#    else
#      @$.overpayment.hide()
#      @$.overpaymentlbl.hide()
#    if paymentstatus.get("multiOrdersList").length > 0 and OB.DEC.compare(paymentstatus.get("total")) >= 0 and OB.DEC.compare(OB.DEC.sub(paymentstatus.get("payment"), paymentstatus.get("total"))) >= 0
#      @$.totalpending.hide()
#      @$.totalpendinglbl.hide()
#      @$.doneaction.show()
#      @$.creditsalesaction.hide()
#
#    #            this.$.layawayaction.hide();
#    else
#      @$.totalpending.setContent OB.I18N.formatCurrency(OB.I18N.formatCurrencyWithSymbol(OB.DEC.mul(OB.DEC.sub(paymentstatus.get("total"), paymentstatus.get("payment")), rate), symbol, symbolAtRight))
#      @$.totalpending.show()
#      @$.totalpendinglbl.show()
#      @$.doneaction.hide()
#      if @$.doneButton.drawerpreference
#        @$.doneButton.setContent OB.I18N.getLabel("OBPOS_LblOpen")
#        @$.doneButton.drawerOpened = false
#    @$.creditsalesaction.hide()
#    @$.layawayaction.hide()
#    if paymentstatus.get("multiOrdersList").length > 0 and OB.DEC.compare(paymentstatus.get("total")) >= 0 and (OB.DEC.compare(OB.DEC.sub(paymentstatus.get("payment"), paymentstatus.get("total"))) >= 0 or paymentstatus.get("total") is 0)
#      @$.exactaction.hide()
#    else
#      @$.exactaction.show()
#    if paymentstatus.get("multiOrdersList").length > 0 and OB.DEC.compare(paymentstatus.get("total")) >= 0 and OB.DEC.compare(OB.DEC.sub(paymentstatus.get("payment"), paymentstatus.get("total"))) >= 0 and not paymentstatus.get("change") and OB.DEC.compare(OB.DEC.sub(paymentstatus.get("payment"), paymentstatus.get("total"))) <= 0
#      if paymentstatus.get("total") is 0
#        @$.exactlbl.hide()
#        @$.donezerolbl.show()
#      else
#        @$.donezerolbl.hide()
#        @$.exactlbl.setContent OB.I18N.getLabel("OBPOS_PaymentsExact")
#        @$.exactlbl.show()
#    else
#      @$.exactlbl.hide()
#      @$.donezerolbl.hide()
#
#  initComponents: ->
#    @inherited arguments
#    @$.totalpendinglbl.setContent OB.I18N.getLabel("OBPOS_PaymentsRemaining")
#    @$.changelbl.setContent OB.I18N.getLabel("OBPOS_PaymentsChange")
#    @$.overpaymentlbl.setContent OB.I18N.getLabel("OBPOS_PaymentsOverpayment")
#    @$.exactlbl.setContent OB.I18N.getLabel("OBPOS_PaymentsExact")
#    @$.donezerolbl.setContent OB.I18N.getLabel("OBPOS_MsgPaymentAmountZero")
#
#  init: (model) ->
#    me = this
#    @model = model
#    @model.get("multiOrders").get("multiOrdersList").on "all", ((event) ->
#      @updatePendingMultiOrders()  if @model.isValidMultiOrderState()
#    ), this
#    @model.get("multiOrders").on "change:payment change:total change:change", (->
#      @updatePendingMultiOrders()
#    ), this
#    @model.get("leftColumnViewManager").on "change:currentView", ((changedModel) ->
#      if changedModel.isOrder()
#        @$.multiPayments.hide()
#        @$.payments.show()
#        return
#      if changedModel.isMultiOrder()
#        @$.multiPayments.show()
#        @$.payments.hide()
#        return
#    ), this
#
#
##    this.model.get('multiOrders').on('change:isMultiOrders', function () {
##      if (!this.model.get('multiOrders').get('isMultiOrders')) {
##        this.$.multiPayments.hide();
##        this.$.payments.show();
##      } else {
##        this.$.payments.hide();
##        this.$.multiPayments.show();
##      }
##    }, this);
#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.DoneButton"
#  kind: "OB.UI.RegularButton"
#  drawerOpened: true
#  init: (model) ->
#    @model = model
#    @setContent OB.I18N.getLabel("OBPOS_LblDone")
#    @model.get("order").on "change:openDrawer", (->
#      @drawerpreference = @model.get("order").get("openDrawer")
#      me = this
#      if @drawerpreference
#        @drawerOpened = false
#        @setContent OB.I18N.getLabel("OBPOS_LblOpen")
#      else
#        @drawerOpened = true
#        @setContent OB.I18N.getLabel("OBPOS_LblDone")
#    ), this
#    @model.get("multiOrders").on "change:openDrawer", (->
#      @drawerpreference = @model.get("multiOrders").get("openDrawer")
#      if @drawerpreference
#        @drawerOpened = false
#        @setContent OB.I18N.getLabel("OBPOS_LblOpen")
#      else
#        @drawerOpened = true
#        @setContent OB.I18N.getLabel("OBPOS_LblDone")
#    ), this
#
#  tap: ->
#    myModel = @owner.model
#    @allowOpenDrawer = false
#    me = this
#    payments = undefined
#    if myModel.get("leftColumnViewManager").isOrder()
#      payments = @owner.receipt.get("payments")
#    else
#      payments = @owner.model.get("multiOrders").get("payments")
#    payments.each (payment) ->
#      me.allowOpenDrawer = true  if payment.get("allowOpenDrawer") or payment.get("isCash")
#
#
#    #if (this.owner.model.get('multiOrders').get('multiOrdersList').length === 0 && !this.owner.model.get('multiOrders').get('isMultiOrders')) {
#    if myModel.get("leftColumnViewManager").isOrder()
#      if @drawerpreference and @allowOpenDrawer
#        if @drawerOpened
#          if @owner.receipt.get("orderType") is 3
#            @owner.receipt.trigger "voidLayaway"
#          else
#            @owner.model.get("order").trigger "paymentDone"
#          @drawerOpened = false
#          @setContent OB.I18N.getLabel("OBPOS_LblOpen")
#        else
#          @owner.receipt.trigger "openDrawer"
#          @drawerOpened = true
#          @setContent OB.I18N.getLabel("OBPOS_LblDone")
#      else
#
#        #Void Layaway
#        if @owner.receipt.get("orderType") is 3
#          @owner.receipt.trigger "voidLayaway"
#        else
#          @owner.receipt.trigger "paymentDone"
#          @owner.receipt.trigger "openDrawer"  if @allowOpenDrawer
#    else
#      if @drawerpreference and @allowOpenDrawer
#        if @drawerOpened
#          @owner.model.get("multiOrders").trigger "paymentDone"
#          @owner.model.get("multiOrders").set "openDrawer", false
#          @drawerOpened = false
#          @setContent OB.I18N.getLabel("OBPOS_LblOpen")
#        else
#          @owner.receipt.trigger "openDrawer"
#          @drawerOpened = true
#          @setContent OB.I18N.getLabel("OBPOS_LblDone")
#      else
#        @owner.model.get("multiOrders").trigger "paymentDone"
#        @owner.model.get("multiOrders").set "openDrawer", false
#        @owner.receipt.trigger "openDrawer"  if @allowOpenDrawer
#
#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.ExactButton"
#  events:
#    onExactPayment: ""
#
#  kind: "OB.UI.RegularButton"
#  classes: "btn-icon-adaptative btn-icon-check btnlink-green"
#  style: "width: 73px; height: 43.37px;"
#  tap: ->
#    @doExactPayment()
#
#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.RenderPaymentLine"
#  classes: "btnselect"
#  components: [
#    style: "color:white;"
#    components: [
#      name: "name"
#      style: "float: left; width: 20%; padding: 5px 0px 0px 0px;"
#    ,
#      name: "info"
#      style: "float: left; width: 15%; padding: 5px 0px 0px 0px;"
#    ,
#      name: "foreignAmount"
#      style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
#    ,
#      name: "amount"
#      style: "float: left; width: 25%; padding: 5px 0px 0px 0px; text-align: right;"
#    ,
#      style: "float: left; width: 20%; text-align: right;"
#      components: [kind: "OB.OBPOSPointOfSale.UI.RemovePayment"]
#    ,
#      style: "clear: both;"
#    ]
#  ]
#  initComponents: ->
#    @inherited arguments
#    @$.name.setContent OB.POS.modelterminal.getPaymentName(@model.get("kind")) or @model.get("name")
#    @$.amount.setContent @model.printAmount()
#    if @model.get("rate") and @model.get("rate") isnt "1"
#      @$.foreignAmount.setContent @model.printForeignAmount()
#    else
#      @$.foreignAmount.setContent ""
#    if @model.get("description")
#      @$.info.setContent @model.get("description")
#    else
#      if @model.get("paymentData")
#        @$.info.setContent @model.get("paymentData").Name
#      else
#        @$.info.setContent ""
#    @hide()  if @model.get("isPrePayment")
#
#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.RemovePayment"
#  events:
#    onRemovePayment: ""
#
#  kind: "OB.UI.SmallButton"
#  classes: "btnlink-darkgray btnlink-payment-clear btn-icon-small btn-icon-clearPayment"
#  tap: ->
#    me = this
#    if _.isUndefined(@deleting) or @deleting is false
#      @deleting = true
#      @removeClass "btn-icon-clearPayment"
#      @addClass "btn-icon-loading"
#      @doRemovePayment
#        payment: @owner.model
#        removeCallback: ->
#          me.deleting = false
#          me.removeClass "btn-icon-loading"
#          me.addClass "btn-icon-clearPayment"
#
#
#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.CreditButton"
#  kind: "OB.UI.SmallButton"
#  i18nLabel: "OBPOS_LblCreditSales"
#  classes: "btn-icon-small btnlink-green"
#  style: "width: 120px; float: right; margin: -5px 5px 0px 0px; height: 1.8em"
#  permission: "OBPOS_receipt.creditsales"
#  events:
#    onShowPopup: ""
#
#  init: (model) ->
#    @model = model
#
#  disabled: false
#  putDisabled: (status) ->
#    if status is false
#      @setDisabled false
#      @removeClass "disabled"
#      @disabled = false
#    else
#      @setDisabled true
#      @addClass "disabled"
#      @disabled = true
#
#  initComponents: ->
#    @inherited arguments
#    @putDisabled not OB.MobileApp.model.hasPermission(@permission)
#
#  tap: ->
#    return true  if @disabled
#    process = new OB.DS.Process("org.openbravo.retail.posterminal.CheckBusinessPartnerCredit")
#    me = this
#    paymentstatus = @model.get("order").getPaymentStatus()
#    if not paymentstatus.isReturn and OB.POS.modelterminal.get("connectedToERP")
#
#      #this.setContent(OB.I18N.getLabel('OBPOS_LblLoading'));
#      process.exec
#        businessPartnerId: @model.get("order").get("bp").get("id")
#        totalPending: @model.get("order").getPending()
#      , (data) ->
#        if data
#          if data.enoughCredit
#            me.doShowPopup
#              popup: "modalEnoughCredit"
#              args:
#                order: me.model.get("order")
#
#
#          #this.setContent(OB.I18N.getLabel('OBPOS_LblCreditSales'));
#          else
#            bpName = data.bpName
#            actualCredit = data.actualCredit
#            me.doShowPopup
#              popup: "modalNotEnoughCredit"
#              args:
#                bpName: bpName
#                actualCredit: actualCredit
#
#
#        #this.setContent(OB.I18N.getLabel('OBPOS_LblCreditSales'));
#        #OB.UI.UTILS.domIdEnyoReference['modalNotEnoughCredit'].$.bodyContent.children[0].setContent();
#        else
#          OB.UTIL.showError OB.I18N.getLabel("OBPOS_MsgErrorCreditSales")
#
#
#    #    } else if (this.model.get('order').get('orderType') === 1) {
#    else if paymentstatus.isReturn
#      actualCredit = undefined
#      creditLimit = @model.get("order").get("bp").get("creditLimit")
#      creditUsed = @model.get("order").get("bp").get("creditUsed")
#      totalPending = @model.get("order").getPending()
#      @doShowPopup
#        popup: "modalEnoughCredit"
#        args:
#          order: @model.get("order")
#
#    else
#      @doShowPopup
#        popup: "modalEnoughCredit"
#        args:
#          order: @model.get("order")
#          message: "OBPOS_Unabletocheckcredit"
#
#
#enyo.kind
#  name: "OB.OBPOSPointOfSale.UI.LayawayButton"
#  kind: "OB.UI.SmallButton"
#  content: ""
#  classes: "btn-icon-small btnlink-green"
#  style: "width: 120px; float: right; margin: -5px 5px 0px 0px; height: 1.8em"
#  permission: "OBPOS_receipt.layaway"
#  events:
#    onShowPopup: ""
#
#  init: (model) ->
#    @model = model
#    @setContent OB.I18N.getLabel("OBPOS_LblLayaway")
#
#  tap: ->
#    receipt = @owner.receipt
#    if receipt
#      if receipt.get("generateInvoice")
#        OB.UTIL.showWarning OB.I18N.getLabel("OBPOS_noInvoiceIfLayaway")
#        receipt.set "generateInvoice", false
#    receipt.trigger "paymentDone"
#    receipt.trigger "openDrawer"
#
