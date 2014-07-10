(function() {
  enyo.kind({
    name: "OB.UI.ModalReceiptLinesProperties",
    kind: "OB.UI.ModalAction",
    handlers: {
      onApplyChanges: "applyChanges"
    },
    i18nHeader: "OBPOS_ReceiptLinePropertiesDialogTitle",
    bodyContent: {
      kind: "Scroller",
      maxHeight: "225px",
      style: "background-color: #ffffff;",
      thumb: true,
      horizontal: "hidden",
      components: [
        {
          name: "attributes"
        }
      ]
    },
    bodyButtons: {
      components: [
        {
          kind: "OB.UI.ReceiptPropertiesDialogApply"
        }, {
          kind: "OB.UI.ReceiptPropertiesDialogCancel"
        }
      ]
    },
    loadValue: function(mProperty, component) {
      this.waterfall("onLoadValue", {
        model: this.currentLine,
        modelProperty: mProperty
      });
      if (component.showProperty) {
        return component.showProperty(this.currentLine, function(value) {
          return component.owner.owner.setShowing(value);
        });
      }
    },
    applyChanges: function(inSender, inEvent) {
      var att, diff, result;
      diff = void 0;
      att = void 0;
      result = true;
      diff = this.propertycomponents;
      for (att in diff) {
        if (diff[att].owner.owner.getShowing()) {
          if (diff.hasOwnProperty(att)) {
            result = result && diff[att].applyValue(this.currentLine);
          }
        }
      }
      $("li.selected").first().children().last().children().filter(function(index) {
        return index === 1;
      }).append("<br><span style='font-size: 14px;'>" + $('#terminal_containerWindow_pointOfSale_receiptLinesPropertiesDialog_bodyContent_attributes_line_receiptLineDescription_newAttribute_receiptLineDescription').val() + "</span>");
      return result;
    },
    validationMessage: function(args) {
      return this.owner.doShowPopup({
        popup: "modalValidateAction",
        args: args
      });
    },
    initComponents: function() {
      this.inherited(arguments);
      this.attributeContainer = this.$.bodyContent.$.attributes;
      this.setHeader(OB.I18N.getLabel(this.i18nHeader));
      this.propertycomponents = {};
      return enyo.forEach(this.newAttributes, (function(natt) {
        var editline;
        editline = this.$.bodyContent.$.attributes.createComponent({
          kind: "OB.UI.PropertyEditLine",
          name: "line_" + natt.name,
          newAttribute: natt
        });
        this.propertycomponents[natt.modelProperty] = editline.propertycomponent;
        return this.propertycomponents[natt.modelProperty].propertiesDialog = this;
      }), this);
    },
    init: function(model) {
      this.model = model;
      return this.model.get("order").get("lines").on("selected", (function(lineSelected) {
        var att, diff, _results;
        diff = void 0;
        att = void 0;
        this.currentLine = lineSelected;
        if (lineSelected) {
          diff = this.propertycomponents;
          _results = [];
          for (att in diff) {
            if (diff.hasOwnProperty(att)) {
              _results.push(this.loadValue(att, diff[att]));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }), this);
    }
  });

  enyo.kind({
    name: "OB.UI.ModalReceiptLinesPropertiesImpl",
    kind: "OB.UI.ModalReceiptLinesProperties",
    newAttributes: [
      {
        kind: "OB.UI.renderTextProperty",
        name: "receiptLineDescription",
        modelProperty: "description",
        i18nLabel: "OBPOS_LblDescription"
      }
    ]
  });

  enyo.kind({
    kind: "OB.UI.ModalInfo",
    name: "OB.UI.ValidateAction",
    header: "",
    isDefaultAction: true,
    bodyContent: {
      name: "message",
      content: ""
    },
    executeOnShow: function() {
      this.$.header.setContent(this.args.header);
      return this.$.bodyContent.$.message.setContent(this.args.message);
    }
  });

}).call(this);
