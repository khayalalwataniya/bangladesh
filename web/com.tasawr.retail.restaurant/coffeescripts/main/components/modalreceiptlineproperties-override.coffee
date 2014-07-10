#
# ************************************************************************************
# * Copyright (C) 2012 Openbravo S.L.U.
# * Licensed under the Openbravo Commercial License version 1.0
# * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
# * or in the legal folder of this module distribution.
# ************************************************************************************
# 

#global enyo, Backbone, $ 
enyo.kind
  name: "OB.UI.ModalReceiptLinesProperties"
  kind: "OB.UI.ModalAction"
  handlers:
    onApplyChanges: "applyChanges"

  i18nHeader: "OBPOS_ReceiptLinePropertiesDialogTitle"
  bodyContent:
    kind: "Scroller"
    maxHeight: "225px"
    style: "background-color: #ffffff;"
    thumb: true
    horizontal: "hidden"
    components: [name: "attributes"]

  bodyButtons:
    components: [
      kind: "OB.UI.ReceiptPropertiesDialogApply"
    ,
      kind: "OB.UI.ReceiptPropertiesDialogCancel"
    ]

  loadValue: (mProperty, component) ->
    @waterfall "onLoadValue",
      model: @currentLine
      modelProperty: mProperty


    # Make it visible or not...
    if component.showProperty
      component.showProperty @currentLine, (value) ->
        component.owner.owner.setShowing value


# else make it visible...
  applyChanges: (inSender, inEvent) ->
    diff = undefined
    att = undefined
    result = true
    diff = @propertycomponents
    for att of diff
      if diff[att].owner.owner.getShowing()
        if diff.hasOwnProperty(att)
          result = result and diff[att].applyValue(@currentLine)

    $("li.selected").first().children().last().children().filter((index) ->
      index is 1
    ).append "<br><span style='font-size: 14px;'>" + $('#terminal_containerWindow_pointOfSale_receiptLinesPropertiesDialog_bodyContent_attributes_line_receiptLineDescription_newAttribute_receiptLineDescription').val() + "</span>"

    result

  validationMessage: (args) ->
    @owner.doShowPopup
      popup: "modalValidateAction"
      args: args


  initComponents: ->
    @inherited arguments
    @attributeContainer = @$.bodyContent.$.attributes
    @setHeader OB.I18N.getLabel(@i18nHeader)
    @propertycomponents = {}
    enyo.forEach @newAttributes, ((natt) ->
      editline = @$.bodyContent.$.attributes.createComponent(
        kind: "OB.UI.PropertyEditLine"
        name: "line_" + natt.name
        newAttribute: natt
      )
      @propertycomponents[natt.modelProperty] = editline.propertycomponent
      @propertycomponents[natt.modelProperty].propertiesDialog = this
    ), this

  init: (model) ->
    @model = model
    @model.get("order").get("lines").on "selected", ((lineSelected) ->
      diff = undefined
      att = undefined
      @currentLine = lineSelected
      if lineSelected
        diff = @propertycomponents
        for att of diff
          @loadValue att, diff[att]  if diff.hasOwnProperty(att)
    ), this

enyo.kind
  name: "OB.UI.ModalReceiptLinesPropertiesImpl"
  kind: "OB.UI.ModalReceiptLinesProperties"
  newAttributes: [
    kind: "OB.UI.renderTextProperty"
    name: "receiptLineDescription"
    modelProperty: "description"
    i18nLabel: "OBPOS_LblDescription"
  ]

enyo.kind
  kind: "OB.UI.ModalInfo"
  name: "OB.UI.ValidateAction"
  header: ""
  isDefaultAction: true
  bodyContent:
    name: "message"
    content: ""

  executeOnShow: ->
    @$.header.setContent @args.header
    @$.bodyContent.$.message.setContent @args.message