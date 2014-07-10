(function() {
  enyo.kind({
    name: "OB.OBPOSPointOfSale.UI.Scan",
    published: {
      receipt: null
    },
    components: [
      {
        style: "position:relative; background-color: #7da7d9; background-size: cover; color: white; height: 150px; margin: 5px; padding: 5px",
        components: [
          {
            kind: "OB.UI.Clock",
            classes: "pos-clock"
          }, {
            components: [
              {
                name: "msgwelcome",
                showing: false,
                style: "padding: 10px;",
                components: [
                  {
                    style: "float:right;",
                    name: "msgwelcomeLbl"
                  }
                ]
              }, {
                name: "msgaction",
                showing: false,
                components: [
                  {
                    name: "txtaction",
                    style: "padding: 10px; float: left; width: 320px; line-height: 23px;"
                  }, {
                    style: "float: right;",
                    components: [
                      {
                        name: "undobutton",
                        kind: "OB.UI.SmallButton",
                        i18nContent: "OBMOBC_LblUndo",
                        classes: "btnlink-white btnlink-fontblue",
                        tap: function() {
                          if (this.undoclick) {
                            return this.undoclick();
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    receiptChanged: function() {
      this.receipt.on("clear change:undo", (function() {
        return this.manageUndo();
      }), this);
      return this.manageUndo();
    },
    manageUndo: function() {
      var undoaction;
      undoaction = this.receipt.get("undo");
      if (undoaction) {
        this.$.msgwelcome.hide();
        this.$.msgaction.show();
        this.$.txtaction.setContent(undoaction.text);
        return this.$.undobutton.undoclick = undoaction.undo;
      } else {
        this.$.msgaction.hide();
        this.$.msgwelcome.show();
        return delete this.$.undobutton.undoclick;
      }
    },
    initComponents: function() {
      this.inherited(arguments);
      return this.$.msgwelcomeLbl.setContent(OB.I18N.getLabel("TSRR_WelcomeMessage"));
    }
  });

}).call(this);
