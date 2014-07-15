(function() {
  enyo.kind({
    kind: "OB.UI.SelectButton",
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
        style: "float: left; width: 10%;"
      }, {
        name: "product",
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
      var me;
      me = this;
      this.inherited(arguments);
      this.$.checkBoxColumn.hide();
      this.$.product.setContent(this.model.get("product").get("_identifier"));
      this.$.quantity.setContent(this.model.printQty());
      this.$.price.setContent(this.model.printPrice());
      if (this.model.get("priceIncludesTax")) {
        this.$.gross.setContent(this.model.printGross());
      } else {
        this.$.gross.setContent(this.model.printNet());
      }
      if (this.model.get("product").get("characteristicDescription")) {
        window.prd = this.model.get("product");
        this.createComponent({
          style: "display: block;",
          components: [
            {
              content: this.model.get("product").get("characteristicDescription"),
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
        if (window.localStorage.getItem(this.model.cid) === null) {
          console.log(this.model.cid);
          this.$.sendstatus.setContent('Not sent');
          window.localStorage.setItem(this.model.cid, 'Not sent');
        } else {
          this.$.sendstatus.setContent(localStorage.getItem(this.model.cid));
        }
      }
      if (this.model.get("promotions")) {
        enyo.forEach(this.model.get("promotions"), (function(d) {
          if (d.hidden) {
            return;
          }
          return this.createComponent({
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
      return OB.MobileApp.model.hookManager.executeHooks("OBPOS_RenderOrderLine", {
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
        return this.changeEditMode(this, inEvent.status);
      } else {
        this.$.gross.hasNode().style.width = "20%";
        this.$.quantity.hasNode().style.width = "20%";
        this.$.price.hasNode().style.width = "20%";
        this.$.product.hasNode().style.width = "40%";
        this.$.checkBoxColumn.hide();
        return this.changeEditMode(this, false);
      }
    }
  });

  enyo.kind({
    name: "OB.UI.RenderOrderLineEmpty",
    style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc",
    initComponents: function() {
      this.inherited(arguments);
      return this.setContent(OB.I18N.getLabel("OBPOS_ReceiptNew"));
    }
  });

  enyo.kind({
    name: "OB.UI.RenderTaxLineEmpty",
    style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc",
    initComponents: function() {
      return this.inherited(arguments);
    }
  });

  enyo.kind({
    kind: "OB.UI.SelectButton",
    name: "OB.UI.RenderTaxLine",
    classes: "btnselect-orderline",
    tap: function() {
      return console.log(this.name);
    },
    components: [
      {
        name: "tax",
        attributes: {
          style: "float: left; width: 60%;"
        }
      }, {
        name: "base",
        attributes: {
          style: "float: left; width: 20%; text-align: right;"
        }
      }, {
        name: "totaltax",
        attributes: {
          style: "float: left; width: 20%; text-align: right;"
        }
      }, {
        style: "clear: both;"
      }
    ],
    selected: function() {
      return console.log(this.name);
    },
    initComponents: function() {
      this.inherited(arguments);
      this.$.tax.setContent(this.model.get("name"));
      this.$.base.setContent(OB.I18N.formatCurrency(this.model.get("net")));
      return this.$.totaltax.setContent(OB.I18N.formatCurrency(this.model.get("amount")));
    }
  });

  enyo.kind({
    kind: "OB.UI.SelectButton",
    name: "OB.UI.RenderPaymentLine",
    classes: "btnselect-orderline",
    style: "border-bottom: 0px",
    tap: function() {
      return console.log(this.name);
    },
    components: [
      {
        name: "name",
        attributes: {
          style: "float: left; width: 40%; padding: 5px 0px 0px 0px;"
        }
      }, {
        name: "date",
        attributes: {
          style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
        }
      }, {
        name: "foreignAmount",
        attributes: {
          style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
        }
      }, {
        name: "amount",
        attributes: {
          style: "float: left; width: 20%; padding: 5px 0px 0px 0px; text-align: right;"
        }
      }, {
        style: "clear: both;"
      }
    ],
    selected: function() {
      return console.log(this.name);
    },
    initComponents: function() {
      var paymentDate;
      paymentDate = void 0;
      this.inherited(arguments);
      this.$.name.setContent(OB.POS.modelterminal.getPaymentName(this.model.get("kind")) || this.model.get("name"));
      if (OB.UTIL.isNullOrUndefined(this.model.get("paymentDate"))) {
        paymentDate = OB.I18N.formatDate(new Date());
      } else {
        paymentDate = OB.I18N.formatDate(this.model.get("paymentDate"));
      }
      this.$.date.setContent(paymentDate);
      if (this.model.get("rate") && this.model.get("rate") !== "1") {
        this.$.foreignAmount.setContent(this.model.printForeignAmount());
      } else {
        this.$.foreignAmount.setContent("");
      }
      return this.$.amount.setContent(this.model.printAmount());
    }
  });

  enyo.kind({
    name: "OB.UI.RenderPaymentLineEmpty",
    style: "border-bottom: 1px solid #cccccc; padding: 20px; text-align: center; font-weight: bold; font-size: 30px; color: #cccccc",
    initComponents: function() {
      return this.inherited(arguments);
    }
  });

}).call(this);
