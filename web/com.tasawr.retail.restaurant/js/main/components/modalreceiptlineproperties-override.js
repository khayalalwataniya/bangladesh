(function() {
  enyo.kind({
    name: "OB.UI.ModalReceiptLinesProperties",
    kind: "OB.UI.ModalAction",
    handlers: {
      onApplyChanges: "applyChanges"
    },
    executeOnShow: function() {
      this.autoDismiss = true;
      if (this && this.args && this.args.autoDismiss === false) {
        this.autoDismiss = false;
      }
    },
    executeOnHide: function() {
      var smthgPending;
      if (this.args && this.args.requiredFiedls && this.args.requiredFieldNotPresentFunction) {
        smthgPending = _.find(this.args.requiredFiedls, function(fieldName) {
          return OB.UTIL.isNullOrUndefined(this.currentLine.get(fieldName));
        }, this);
        if (smthgPending) {
          this.args.requiredFieldNotPresentFunction(this.currentLine, smthgPending);
        }
      }
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
          kind: "OB.UI.ReceiptPropertiesDialogApply",
          name: "receiptLinePropertiesApplyBtn"
        }, {
          kind: "OB.UI.ReceiptPropertiesDialogCancel",
          name: "receiptLinePropertiesCancelBtn"
        }
      ]
    },
    loadValue: function(mProperty, component) {
      this.waterfall("onLoadValue", {
        model: this.currentLine,
        modelProperty: mProperty
      });
      if (component.showProperty) {
        component.showProperty(this.currentLine, function(value) {
          component.owner.owner.setShowing(value);
        });
      }
    },
    applyChanges: function(inSender, inEvent) {
      var att, diff, me, result;
      me = this;
      diff = void 0;
      att = void 0;
      result = true;
      diff = me.propertycomponents;
      for (att in diff) {
        if (diff.hasOwnProperty(att) ? diff[att].owner.owner.getShowing() : void 0) {
          result = result && diff[att].applyValue(me.currentLine);
        }
        if (result) {
          diff[att].applyChange(inSender, inEvent);
        }
      }
      return result;
    },
    validationMessage: function(args) {
      this.owner.doShowPopup({
        popup: "modalValidateAction",
        args: args
      });
    },
    initComponents: function() {
      this.inherited(arguments);
      this.attributeContainer = this.$.bodyContent.$.attributes;
      this.setHeader(OB.I18N.getLabel(this.i18nHeader));
      this.propertycomponents = {};
      enyo.forEach(this.newAttributes, (function(natt) {
        var editline;
        editline = this.$.bodyContent.$.attributes.createComponent({
          kind: "OB.UI.PropertyEditLine",
          name: "line_" + natt.name,
          newAttribute: natt
        });
        this.propertycomponents[natt.modelProperty] = editline.propertycomponent;
        this.propertycomponents[natt.modelProperty].propertiesDialog = this;
      }), this);
    },
    init: function(model) {
      this.model = model;
      this.model.get("order").get("lines").on("selected", (function(lineSelected) {
        var att, diff;
        diff = void 0;
        att = void 0;
        this.currentLine = lineSelected;
        if (lineSelected) {
          diff = this.propertycomponents;
          for (att in diff) {
            if (diff.hasOwnProperty(att)) {
              this.loadValue(att, diff[att]);
            }
          }
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
      this.$.bodyContent.$.message.setContent(this.args.message);
    }
  });

}).call(this);
