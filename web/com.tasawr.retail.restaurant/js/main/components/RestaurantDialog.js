(function() {
  enyo.kind({
    kind: "OB.UI.ModalDialogButton",
    name: "TSRR.Main.UI.LineAttributeDialogApply",
    isDefaultAction: true,
    events: {
      onApplyChanges: ""
    },
    tap: function() {
      var addedAttributes, key;
      addedAttributes = '';
      for (key in localStorage) {
        if (key.indexOf("productAttribute") > -1) {
          addedAttributes = addedAttributes + (localStorage.getItem(key)) + '_';
          localStorage.removeItem(key);
        }
      }
      if (addedAttributes.charAt(0) === '_') {
        addedAttributes = addedAttributes.substr(1);
      }
      if ($("#productAttributeSpan").length === 0) {
        $("li.selected").first().children().last().children().filter(function(index) {
          return index === 1;
        }).append("<div style='font-size: 14px;' id='productAttributeSpan'>" + addedAttributes.substring(0, addedAttributes.length - 1) + "</div>");
      } else {
        $("#productAttributeSpan").text(addedAttributes.substring(0, addedAttributes.length - 1));
      }
      this.doHideThisPopup();
    },
    initComponents: function() {
      this.inherited(arguments);
      this.setContent(OB.I18N.getLabel("OBMOBC_LblApply"));
    }
  });

  enyo.kind({
    name: "TSRR.Main.UI.AttributePopup",
    kind: "OB.UI.ModalAction",
    i18nHeader: "TSRR_AttributeModalHeaderMessage",
    handlers: {
      onApplyChanges: "applyChanges"
    },
    executeOnShow: function() {
      console.log("calling TSRR.Main.UI.AttributePopup.executeOnShow");
      this.$.bodyContent.destroyClientControls();
      this.loadAttributesFromProduct(this.args.line.attributes.product);
      this.autoDismiss = true;
      if (this && this.args && this.args.autoDismiss === false) {
        this.autoDismiss = false;
      }
    },
    executeOnHide: function() {
      console.log("hiding TSRR.Main.UI.AttributePopup.executeOnHide");
    },
    bodyContent: {
      components: [
        {
          name: "productAttributes"
        }
      ]
    },
    bodyButtons: {
      components: [
        {
          kind: "TSRR.Main.UI.LineAttributeDialogApply"
        }, {
          kind: "OB.UI.CancelDialogButton"
        }
      ]
    },
    initComponents: function() {
      return this.inherited(arguments);
    },
    init: function(model) {
      return this.model = model;
    },
    loadAttributesFromProduct: function(product) {
      var me;
      me = this;
      return new OB.DS.Process("com.tasawr.retail.restaurant.data.ProductAttributeSetService").exec({
        id: product.id
      }, function(data) {
        console.error(data);
        return me.loadAttributes(data);
      });
    },
    loadAttributes: function(attributes) {
      var me;
      me = this;
      _.each(attributes, function(attributeValues, attributeName) {
        return me.loadAttribute(attributeName, attributeValues);
      });
    },
    loadAttribute: function(attributeName, attributeValues) {
      var me;
      me = this;
      this.$.bodyContent.createComponent({
        kind: 'TSRR.Attributes.AttributeItem',
        attributeName: attributeName,
        attributeValues: attributeValues
      });
      return me.$.bodyContent.render();
    },
    dalError: function(tx, error) {
      return OB.UTIL.showError("OBDAL error: " + error);
    }
  });

  enyo.kind({
    name: "TSRR.Main.UI.OriginalOrder",
    classes: "row-fluid",
    published: {
      receipt: null
    },
    handlers: null,
    events: null,
    components: [
      {
        classes: "span12",
        components: [
          {
            style: "border-bottom: 1px solid #cccccc;",
            classes: "row-fluid",
            components: [
              {
                classes: "span12",
                components: [
                  {
                    name: "lineItemList",
                    kind: "OB.UI.ScrollableTable",
                    scrollAreaMaxHeight: "400px",
                    renderHeader: "TSRR.Main.UI.SummaryHeader",
                    renderLine: "TSRR.Main.UI.SummaryRender",
                    renderEmpty: "OB.UI.RenderEmpty"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    initComponents: function() {
      return this.inherited(arguments);
    },
    executeOnShow: function() {
      return console.log("calling executeOnShow on TSRR.Main.UI.OriginalOrder");
    }
  });

  enyo.kind({
    name: "TSRR.Main.UI.SplitedOrder",
    kind: "OB.OBPOSPointOfSale.UI.ReceiptView"
  });

  OB.UI.WindowView.registerPopup("OB.OBPOSPointOfSale.UI.PointOfSale", {
    kind: "TSRR.Main.UI.AttributePopup",
    name: "TSRR_Main_UI_AttributePopup"
  });

}).call(this);
