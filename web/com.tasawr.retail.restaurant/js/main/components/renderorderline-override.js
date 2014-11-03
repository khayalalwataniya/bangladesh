(function() {
  enyo.kind({
    kind: "OB.UI.listItemButton",
    name: "OB.UI.RenderOrderLine",
    classes: "btnselect-orderline",
    handlers: {
      onChangeEditMode: "changeEditMode",
      onCheckBoxBehaviorForTicketLine: "checkBoxForTicketLines"
    },
    events: {
      onLineChecked: ""
    },
    components: [
      {
        name: "checkBoxColumn",
        kind: "OB.UI.CheckboxButton",
        tag: "div",
        tap: function() {},
        style: "float: left; width: 10%;"
      }, {
        name: "product",
        allowHtml: true,
        attributes: {
          style: "float: left; width: 40%;"
        }
      }, {
        name: "quantity",
        attributes: {
          style: "float: left; width: 10%; text-align: right;"
        }
      }, {
        name: "price",
        attributes: {
          style: "float: left; width: 15%; text-align: right;"
        }
      }, {
        name: "gross",
        attributes: {
          style: "float: left; width: 15%; text-align: right;"
        }
      }, {
        name: "sendstatus",
        attributes: {
          style: "float: left; width: 20%; text-align: right;"
        }
      }, {
        kind: "Signals",
        onTransmission: "transmission"
      }, {
        style: "clear: both;"
      }
    ],
    initComponents: function() {
      this.inherited(arguments);
      this.$.checkBoxColumn.hide();
      this.$.product.setContent(this.model.get("product").get("_identifier"));
      if (this.model.get("description")) {
        this.$.product.setContent(this.model.get("product").get("_identifier") + '<br>-- ' + this.model.get("description"));
      }
      this.$.quantity.setContent(this.model.printQty());
      this.$.price.setContent(this.model.printPrice());
      if (this.model.get("priceIncludesTax")) {
        this.$.gross.setContent(this.model.printGross());
      } else {
        this.$.gross.setContent(this.model.printNet());
      }
      if (this.model.get("product").get("characteristicDescription")) {
        this.createComponent({
          style: "display: block;",
          components: [
            {
              content: OB.UTIL.getCharacteristicValues(this.model.get("product").get("characteristicDescription")),
              attributes: {
                style: "float: left; width: 60%; color:grey"
              }
            }, {
              style: "clear: both;"
            }
          ]
        });
      }
      if (this.model.cid !== null) {
        if (localStorage.getItem(this.model.cid) === null) {
          this.$.sendstatus.setContent('Not sent');
          localStorage.setItem(this.model.cid, 'Not sent');
        } else {
          this.$.sendstatus.setContent(localStorage.getItem(this.model.cid));
        }
      }
      if (this.model.get("promotions")) {
        enyo.forEach(this.model.get("promotions"), (function(d) {
          if (d.hidden) {
            return;
          }
          this.createComponent({
            style: "display: block;",
            components: [
              {
                content: "-- " + d.name,
                attributes: {
                  style: "float: left; width: 80%;"
                }
              }, {
                content: OB.I18N.formatCurrency(-d.amt),
                attributes: {
                  style: "float: right; width: 20%; text-align: right;"
                }
              }, {
                style: "clear: both;"
              }
            ]
          });
        }), this);
      }
      OB.MobileApp.model.hookManager.executeHooks("OBPOS_RenderOrderLine", {
        orderline: this
      }, function(args) {});
    },
    transmission: function(inSender, inPayload) {
      this.inherited(arguments);
      if (this.model.cid === inPayload.cid) {
        this.container.children[0].controls[5].setContent(inPayload.message);
        return localStorage.setItem(inPayload.cid, inPayload.message);
      }
    },
    changeEditMode: function(inSender, inEvent) {
      this.addRemoveClass("btnselect-orderline-edit", inEvent.edit);
      return this.bubble("onShowColumn", {
        colNum: 1
      });
    },
    checkBoxForTicketLines: function(inSender, inEvent) {
      if (inEvent.status) {
        this.$.gross.hasNode().style.width = "18%";
        this.$.quantity.hasNode().style.width = "16%";
        this.$.price.hasNode().style.width = "18%";
        this.$.product.hasNode().style.width = "38%";
        this.$.checkBoxColumn.show();
        this.changeEditMode(this, inEvent.status);
      } else {
        this.$.gross.hasNode().style.width = "20%";
        this.$.quantity.hasNode().style.width = "20%";
        this.$.price.hasNode().style.width = "20%";
        this.$.product.hasNode().style.width = "40%";
        this.$.checkBoxColumn.hide();
        this.changeEditMode(this, false);
      }
    }
  });

}).call(this);
