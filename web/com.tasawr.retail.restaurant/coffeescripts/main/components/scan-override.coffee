#
# ************************************************************************************
# * Copyright (C) 2012 Openbravo S.L.U.
# * Licensed under the Openbravo Commercial License version 1.0
# * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
# * or in the legal folder of this module distribution.
# ************************************************************************************
# 

#global enyo

enyo.kind
  name: "OB.OBPOSPointOfSale.UI.Scan"
  published:
    receipt: null

  components: [
    style: "position:relative; background-color: #7da7d9; background-size: cover; color: white; height: 150px; margin: 5px; padding: 5px"
    components: [
      kind: "OB.UI.Clock"
      classes: "pos-clock"
    ,
      components: [
        name: "msgwelcome"
        showing: false
        style: "padding: 10px;"
        components: [
          style: "float:right;"
          name: "msgwelcomeLbl"
        ]
      ,
        name: "msgaction"
        showing: false
        components: [
          name: "txtaction"
          style: "padding: 10px; float: left; width: 320px; line-height: 23px;"
        ,
          style: "float: right;"
          components: [
            name: "undobutton"
            kind: "OB.UI.SmallButton"
            i18nContent: "OBMOBC_LblUndo"
            classes: "btnlink-white btnlink-fontblue"
            tap: ->
              @undoclick()  if @undoclick
          ]
        ]
      ]
    ]
  ]
  receiptChanged: ->
    @receipt.on "clear change:undo", (->
      @manageUndo()
    ), this
    @manageUndo()

  manageUndo: ->
    undoaction = @receipt.get("undo")
    if undoaction
      @$.msgwelcome.hide()
      @$.msgaction.show()
      @$.txtaction.setContent undoaction.text
      @$.undobutton.undoclick = undoaction.undo
    else
      @$.msgaction.hide()
      @$.msgwelcome.show()
      delete @$.undobutton.undoclick

  initComponents: ->
    @inherited arguments
    @$.msgwelcomeLbl.setContent OB.I18N.getLabel("TSRR_WelcomeMessage")

