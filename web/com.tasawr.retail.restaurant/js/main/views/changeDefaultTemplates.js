(function() {
  OB.OBPOSPointOfSale.Print.ReceiptTemplate = "../com.tasawr.retail.restaurant/receipts/printreceipt.xml";

  OB.OBPOSPointOfSale.Print.HoldTemplate = "../com.tasawr.retail.restaurant/receipts/holdline.xml";

  OB.OBPOSPointOfSale.Print.FireTemplate = "../com.tasawr.retail.restaurant/receipts/fireline.xml";

  OB.OBPOSPointOfSale.Print.SendTemplate = "../com.tasawr.retail.restaurant/receipts/sendline.xml";

  OB.OBPOSPointOfSale.Print.CancelTemplate = "../com.tasawr.retail.restaurant/receipts/cancelline.xml";

  OB.OBPOSPointOfSale.Print.SendOrderTemplate = "../com.tasawr.retail.restaurant/receipts/sendorder.xml";

  OB.OBPOSPointOfSale.Print.CancelOrderTemplate = "../com.tasawr.retail.restaurant/receipts/cancelorder.xml";

  OB.OBPOSPointOfSale.Print.LineTemplate = "../com.tasawr.retail.restaurant/receipts/printline.xml";

  OB.UI.ModalReceiptPropertiesImpl.extend({
    initComponents: function() {
      var customAttributes, i;
      i = void 0;
      customAttributes = [];
      i = 0;
      while (i < this.newAttributes.length) {
        if (this.newAttributes[i].name !== "receiptDescription") {
          customAttributes.push(this.newAttributes[i]);
        }
        i++;
      }
      customAttributes.unshift({
        kind: "OB.UI.renderTextMultiLineProperty",
        name: "receiptDescription",
        modelProperty: "description",
        i18nLabel: "TSRR_TransferReceiptDescriptionLabel"
      }, {
        kind: "OB.UI.renderComboProperty",
        name: "restaurantTableBox",
        modelProperty: "restaurantTable",
        i18nLabel: "TSRR_TransferToTableLabel",
        collection: new OB.Collection.TableList(),
        retrievedPropertyForValue: "id",
        retrievedPropertyForText: "_identifier",
        init: function(model) {
          this.model = model;
        },
        applyChange: function(inSender, inEvent) {
          var selected;
          selected = this.collection.at(this.$.renderCombo.getSelected());
          console.info('applying changes with');
          console.info(selected);
          if (selected) {
            inSender.model.set(this.modelProperty, selected.get(this.retrievedPropertyForValue));
          }
          if (this.modelPropertyText) {
            inSender.model.set(this.modelPropertyText, selected.get(this.retrievedPropertyForText));
          }
        },
        fetchDataFunction: function(args) {
          var actualTable, me;
          me = this;
          actualTable = void 0;
          OB.Dal.find(OB.Model.Table, null, (function(data, args) {
            if (data.length > 0) {
              me.dataReadyFunction(data, args);
            } else {
              actualTable = new OB.Model.Table();
              actualTable.set("_identifier", me.model.get("order").get("restaurantTable$_identifier"));
              actualTable.set("id", me.model.get("order").get("restaurantTable"));
              data.models = [actualTable];
              me.dataReadyFunction(data, args);
            }
          }), (function(error) {
            OB.UTIL.showError(OB.I18N.getLabel("TSRR_ErrorGettingTable"));
            me.dataReadyFunction(null, args);
          }), args);
        }
      });
      this.newAttributes = customAttributes;
      this.inherited(arguments);
    }
  });

}).call(this);
