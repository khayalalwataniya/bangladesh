#global enyo, Backbone, _

OB.OBPOSPointOfSale.Print.ReceiptTemplate = "../com.tasawr.retail.restaurant/receipts/printreceipt.xml"
#OB.OBPOSPointOfSale.Print.ReceiptTemplate = "../org.openbravo.retail.posterminal/res/printreceipt.xml"
OB.OBPOSPointOfSale.Print.SendOrderTemplate = "../com.tasawr.retail.restaurant/receipts/sendorder.xml"
OB.OBPOSPointOfSale.Print.CancelOrderTemplate = "../com.tasawr.retail.restaurant/receipts/cancelorder.xml"
OB.OBPOSPointOfSale.Print.LineTemplate = "../com.tasawr.retail.restaurant/receipts/printline.xml"

OB.OBPOSPointOfSale.Print.NonGenericLineTemplate = "../com.tasawr.retail.restaurant/receipts/nonGenericLine.xml"
OB.OBPOSPointOfSale.Print.GenericLineTemplate = "../com.tasawr.retail.restaurant/receipts/genericLine.xml"



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
    kind: "OB.UI.renderTextProperty"
    name: "receiptDescription"
    modelProperty: "description"
    i18nLabel: "TSRR_TransferReceiptDescriptionLabel"
  ,
    kind: "OB.UI.renderTextProperty"
    name: "receiptNumberOfGuests"
    modelProperty: "numberOfGuests"
    i18nLabel: "TSRR_LblGuestCount"
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
      bi = TSRR.Tables.Config.currentTable.bookingInfoList.at(TSRR.Tables.Config.currentTable.bookingInfoList.length - 1)
      bi.set 'restaurantTable', selected
      bi.set 'businessPartner', OB.POS.modelterminal.attributes.businessPartner
      bi.set 'salesOrder', TSRR.Tables.Config.currentOrder
      bi.save()
      OB.UTIL.showSuccess '[DONE] Booking Info with ID: "' + bi.id + '" has been updated succussfully'
      inSender.model.set @modelProperty, selected.get(@retrievedPropertyForValue)  if selected
      inSender.model.set @modelPropertyText, selected.get(@retrievedPropertyForText)  if @modelPropertyText
      return

    fetchDataFunction: (args) ->
      me = this
      actualTable = undefined

      if window.localStorage.getItem('currentSection')
        crieteria =
          tsrrSection: JSON.parse(window.localStorage.getItem('currentSection')).id
      else
        crieteria =
          tsrrSection: ""

      OB.Dal.find OB.Model.Table, crieteria, ((data, args) ->
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
