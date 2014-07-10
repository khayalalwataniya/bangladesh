#global enyo, Backbone, _

OB.OBPOSPointOfSale.Print.ReceiptTemplate = "../com.tasawr.retail.restaurant/receipts/printreceipt.xml"
OB.OBPOSPointOfSale.Print.HoldTemplate = "../com.tasawr.retail.restaurant/receipts/holdline.xml"
OB.OBPOSPointOfSale.Print.FireTemplate = "../com.tasawr.retail.restaurant/receipts/fireline.xml"
OB.OBPOSPointOfSale.Print.SendTemplate = "../com.tasawr.retail.restaurant/receipts/sendline.xml"
OB.OBPOSPointOfSale.Print.CancelTemplate = "../com.tasawr.retail.restaurant/receipts/cancelline.xml"
OB.OBPOSPointOfSale.Print.SendOrderTemplate = "../com.tasawr.retail.restaurant/receipts/sendorder.xml"
OB.OBPOSPointOfSale.Print.CancelOrderTemplate = "../com.tasawr.retail.restaurant/receipts/cancelorder.xml"
OB.OBPOSPointOfSale.Print.LineTemplate = "../com.tasawr.retail.restaurant/receipts/printline.xml"


OB.UI.ModalReceiptPropertiesImpl.extend initComponents: ->
  i = undefined
  customAttributes = []

  # remove standard receipt description
  i = 0
  while i < @newAttributes.length
    customAttributes.push @newAttributes[i]  if @newAttributes[i].name isnt "receiptDescription"
    i++

  # add custom receipt properties at the beginning
  customAttributes.unshift
    kind: "OB.UI.renderTextMultiLineProperty"
    name: "receiptDescription"
    modelProperty: "description"
    i18nLabel: "TSRR_TransferReceiptDescriptionLabel"
  ,
    kind: "OB.UI.renderComboProperty"
    name: "restaurantTableBox"
    modelProperty: "restaurantTable"
    #extraProperties: ["Table.id"]
    i18nLabel: "TSRR_TransferToTableLabel"
    collection: new OB.Collection.TableList()
    retrievedPropertyForValue: "id"
    retrievedPropertyForText: "_identifier"
    init: (model) ->
      @model = model
      return

    applyChange: (inSender, inEvent) ->
      selected = @collection.at(@$.renderCombo.getSelected())
      console.info 'applying changes with'
      console.info selected
      inSender.model.set @modelProperty, selected.get(@retrievedPropertyForValue)  if selected
      inSender.model.set @modelPropertyText, selected.get(@retrievedPropertyForText)  if @modelPropertyText
      return

    fetchDataFunction: (args) ->
      me = this
      actualTable = undefined
      OB.Dal.find OB.Model.Table, null, ((data, args) ->
        if data.length > 0
          me.dataReadyFunction data, args
        else
          actualTable = new OB.Model.Table()
          actualTable.set "_identifier", me.model.get("order").get("restaurantTable$_identifier")
          actualTable.set "id", me.model.get("order").get("restaurantTable")
          data.models = [actualTable]
          me.dataReadyFunction data, args
        return
      ), ((error) ->
        OB.UTIL.showError OB.I18N.getLabel("TSRR_ErrorGettingTable")
        me.dataReadyFunction null, args
        return
      ), args
      return

  @newAttributes = customAttributes
  @inherited arguments
  return


#enyo.kind
#  name: "TSRR.Main.UI.TransferApplyButton"
#  kind: "OB.UI.ModalDialogButton"
#  style: "color: white; background-color: orange;"
#  isDefaultAction: true
#  events:
#    onApplyChanges: ""
#
#  tap: ->
#    console.info 'TSRR.Main.UI.TransferApplyButton tapped'
#    salesOrder = @parent.parent.parent.parent.model
#
#    debugger
#    @doHideThisPopup()
#    return
#
#  initComponents: ->
#    @inherited arguments
#    @setContent 'Transfer'
#    return


#enyo.kind
#  name: "TSRR.Main.UI.ModalChooseOrder"
#  kind: "OB.UI.ModalAction"
#  handlers:
#    onApplyChanges: "applyChanges"
#
#  bodyContent:
#    kind: "Scroller"
#    maxHeight: "225px"
#    style: "background-color: #ffffff;"
#    thumb: true
#    horizontal: "hidden"
#    components: [
#      name: "attributes"
#    ]
#
#  bodyButtons:
#    components: [
#      {
#        kind: "TSRR.Main.UI.TransferApplyButton"
#      }
#      {
#        kind: "OB.UI.ReceiptPropertiesDialogCancel"
#      }
#    ]
#
#  loadValue: (mProperty) ->
#    @waterfall "onLoadValue",
#      model: @model
#      modelProperty: mProperty
#
#    return
#
#  applyChanges: (inSender, inEvent) ->
#    @waterfall "onApplyChange", {}
#    true
#
#  initComponents: ->
#    @inherited arguments
#    @attributeContainer = @$.bodyContent.$.attributes
#    enyo.forEach @newAttributes, ((natt) ->
#      @$.bodyContent.$.attributes.createComponent
#        kind: "OB.UI.PropertyEditLine"
#        name: "line_" + natt.name
#        newAttribute: natt
#
#      return
#    ), this
#    return


#enyo.kind
#  name: "TSRR.Main.UI.ModalChooseOrderImpl"
#  kind: "TSRR.Main.UI.ModalChooseOrder"
#  newAttributes: [
#    {
#      kind: "OB.UI.renderTextProperty"
#      name: "receiptDescription"
#      modelProperty: "description"
#      i18nLabel: "OBPOS_LblDescription"
#    }
#    {
#      kind: "OB.UI.renderBooleanProperty"
#      name: "printBox"
#      checked: true
#      classes: "modal-dialog-btn-check active"
#      modelProperty: "print"
#      i18nLabel: "OBPOS_Lbl_RP_Print"
#    }
#    {
#      kind: "OB.UI.renderComboProperty"
#      name: "restaurantTableBox"
#      modelProperty: "restaurantTable"
#      i18nLabel: "TSRR_TransferToTableLabel"
#      collection: new OB.Collection.SalesRepresentativeList()
#      retrievedPropertyForValue: "id"
#      retrievedPropertyForText: "_identifier"
#      init: (model) ->
#        @model = model
#        return
#
#      fetchDataFunction: (args) ->
#        me = this
#        actualTable = undefined
#        OB.Dal.find OB.Model.Table, null, ((data, args) ->
#          if data.length > 0
#            me.dataReadyFunction data, args
#          else
#            actualTable = new OB.Model.Table()
#            actualTable.set "_identifier", me.model.get("order").get("restaurantTable$_identifier")
#            actualTable.set "id", me.model.get("order").get("restaurantTable")
#            data.models = [actualTable]
#            me.dataReadyFunction data, args
#          return
#        ), ((error) ->
#          OB.UTIL.showError 'OB.I18N.getLabel("OBPOS_ErrorGettingTable")'
#          me.dataReadyFunction null, args
#          return
#        ), args
#        return
#    }
#  ]
#
#  resetProperties: ->
#    p = undefined
#    att = undefined
#
#    # reset all properties
#    for p of @newAttributes
#      if @newAttributes.hasOwnProperty(p)
#        att = @$.bodyContent.$.attributes.$["line_" + @newAttributes[p].name].$.newAttribute.$[@newAttributes[p].name]
#        att.setValue ""  if att and att.setValue
#    return
#
#  init: (model) ->
#    @setHeader OB.I18N.getLabel("OBPOS_ReceiptPropertiesDialogTitle")
#    @model = model.get("order")
#    @model.bind "change", (->
#      diff = @model.changedAttributes()
#      att = undefined
#      for att of diff
#        @loadValue att  if diff.hasOwnProperty(att)
#      return
#    ), this
#    @model.bind "paymentAccepted", (->
#      @resetProperties()
#      return
#    ), this
#    return
#
#
#OB.UI.WindowView.registerPopup "OB.OBPOSPointOfSale.UI.PointOfSale",
#  kind: "TSRR.Main.UI.ModalChooseOrderImpl"
#  name: "TSRR_Main_UI_ModalChooseOrderImpl"
