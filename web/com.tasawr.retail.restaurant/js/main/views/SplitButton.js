(function() {
  (function() {
    var splitOrder;
    splitOrder = void 0;
    enyo.kind({
      name: "TSRR.Main.UI.ApplyDialogButton",
      kind: "OB.UI.ModalDialogButton",
      isDefaultAction: true,
      events: {
        onHideThisPopup: "",
        onAcceptButton: ""
      },
      disabled: false,
      putDisabled: function(state) {
        if (state === false) {
          this.setDisabled(false);
          this.removeClass("disabled");
          this.setAttribute("disabled", null);
          return this.disabled = false;
        } else {
          this.setDisabled();
          this.addClass("disabled");
          this.setAttribute("disabled", "disabled");
          return this.disabled = true;
        }
      },
      tap: function() {
        if (this.disabled) {
          return;
        }
        return this.doAcceptButton();
      },
      initComponents: function() {
        this.inherited(arguments);
        return this.setContent(OB.I18N.getLabel("OBMOBC_LblApply"));
      }
    });
    enyo.kind({
      name: "TSRR.Main.UI.DetailsDialogButton",
      kind: "OB.UI.ModalDialogButton",
      style: "color: white; background-color: orange;",
      isDefaultAction: true,
      events: {
        onHideThisPopup: "",
        onDetailsButton: ""
      },
      tap: function() {
        return this.doDetailsButton();
      },
      initComponents: function() {
        this.inherited(arguments);
        return this.setContent(OB.I18N.getLabel("TSRR_LblDetails"));
      }
    });
    enyo.kind({
      name: "TSRR.Main.UI.RestaurantHomeButton",
      kind: "OB.UI.ToolbarButton",
      i18nLabel: "TSRR_LblRestaurants",
      tap: function() {
        return OB.POS.navigate("retail.restaurantmode");
      },
      initComponents: function() {
        return this.inherited(arguments);
      }
    });
    enyo.kind({
      name: "OB.OBPOSPointOfSale.UI.LeftToolbarImpl",
      kind: "OB.UI.MultiColumn.Toolbar",
      showMenu: true,
      showWindowsMenu: true,
      menuEntries: [],
      buttons: [
        {
          kind: "TSRR.Main.UI.RestaurantHomeButton",
          span: 4
        }, {
          kind: "OB.UI.ButtonNew",
          span: 2
        }, {
          kind: "OB.UI.ButtonDelete",
          span: 2
        }, {
          kind: "OB.OBPOSPointOfSale.UI.ButtonTabPayment",
          name: "payment",
          span: 4
        }
      ],
      initComponents: function() {
        this.menuEntries.push({
          kind: "OB.UI.MenuReturn"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuVoidLayaway"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuProperties"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuInvoice"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuPrint"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuLayaway"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuCustomers"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuPaidReceipts"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuQuotations"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuOpenDrawer"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuSeparator",
          name: "sep1"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuDiscounts"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuSeparator",
          name: "sep2"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuReactivateQuotation"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuRejectQuotation"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuCreateOrderFromQuotation"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuQuotation"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuLayaways"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuMultiOrders"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuSeparator",
          name: "sep3"
        });
        this.menuEntries.push({
          kind: "OB.UI.MenuBackOffice"
        });
        this.menuEntries = _.uniq(this.menuEntries, false, function(p) {
          return p.kind + p.name;
        });
        this.inherited(arguments);
      }
    });
    OB.OBPOSPointOfSale.UI.ToolbarPayment.prototype.sideButtons.push({
      command: "SplitOrder",
      i18nLabel: "TSRR_BtnSplitOrder",
      permission: "com.tasawr.retail.restaurant.SplitOrder",
      stateless: true,
      action: function(keyboard, txt) {
        var amount;
        amount = void 0;
        amount = OB.DEC.number(OB.I18N.parseNumber(txt || ""));
        amount = (_.isNaN(amount) ? keyboard.receipt.getPending() : amount);
        return keyboard.doShowPopup({
          popup: "TSRR_UI_ModalReceiptsSplit",
          args: {
            keyboard: keyboard,
            header: OB.I18N.getLabel("TSRR_RestaurantSearchDialogHeaderMessage", [OB.I18N.formatCurrency(amount)]),
            amount: amount,
            model: keyboard.receipt,
            receiptsInfo: keyboard.receipt,
            action: function(dialog) {}
          }
        });
      }
    });
    splitOrder = function(model) {
      return console.log(model);
    };
    OB.Model.modelLoaders.push(splitOrder);
  }).call(this);

}).call(this);
