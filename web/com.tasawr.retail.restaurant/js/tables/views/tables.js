(function() {
  enyo.kind({
    name: "TSRR.Tables.UI.LeftToolbarImpl",
    kind: "OB.UI.MultiColumn.Toolbar",
    showMenu: true,
    showWindowsMenu: true,
    buttons: [
      {
        kind: "OB.UI.ToolbarButton",
        name: "btnHome",
        disabled: false,
        i18nLabel: "TSRR_BackLabel",
        stepCount: 0,
        span: 4,
        tap: function() {
          if (this.disabled) {
            return true;
          }
          OB.POS.navigate("retail.restaurantmode");
        }
      }, {
        kind: "OB.UI.ToolbarButton",
        name: "btnPos",
        disabled: false,
        i18nLabel: "TSRR_Lbl_POS",
        stepCount: 0,
        span: 3,
        tap: function() {
          if (this.disabled) {
            return true;
          }
          OB.POS.navigate("retail.pointofsale");
        }
      }, {
        kind: "OB.UI.ToolbarButton",
        name: "btnDone",
        disabled: true,
        i18nLabel: "TSRR_Lbl_BackOffice",
        stepCount: 0,
        span: 5,
        init: function() {
          return this.setContent(OB.POS.modelterminal.attributes.businessPartner.attributes.name);
        }
      }
    ]
  });

  enyo.kind({
    name: "TSRR.Tables.UI.RightToolbarImpl",
    kind: "OB.UI.MultiColumn.Toolbar",
    buttons: [
      {
        kind: "OB.UI.ToolbarButton",
        name: "btnRestaurant",
        span: 12,
        disabled: true,
        i18nLabel: "TSRR_LblRestaurants_Large"
      }
    ]
  });

  enyo.kind({
    name: 'TSRR.Tables.UI.Tables',
    kind: 'OB.UI.WindowView',
    windowmodel: OB.Model.TablesWindow,
    tag: 'tsrrSection',
    events: {
      onShowPopup: ''
    },
    published: {
      orderList: null,
      order: null
    },
    handlers: {
      onChangeBusinessPartner: 'changeBusinessPartner',
      onSelectSection: 'selectSection',
      onSelectTable: 'selectTable',
      onHideThisPopup: 'hideThisPopup'
    },
    components: [
      {
        classes: "row",
        components: [
          {
            classes: "span6",
            kind: "TSRR.Tables.UI.LeftToolbarImpl",
            name: "leftToolbar"
          }, {
            classes: "span6",
            kind: "TSRR.Tables.UI.RightToolbarImpl",
            name: "rightToolbar"
          }
        ]
      }, {
        classes: 'row',
        components: [
          {
            classes: 'span10',
            components: [
              {
                style: 'margin: 5px;',
                components: [
                  {
                    name: 'caption',
                    kind: 'OB.UI.Button',
                    classes: 'btnkeyboard btnkeyboard-inactive ',
                    style: 'color: white; text-align: left; padding: 20px;',
                    disabled: true,
                    content: 'Please choose a section'
                  }
                ]
              }
            ]
          }, {
            classes: 'span2',
            components: [
              {
                style: 'margin: 5px',
                components: [
                  {
                    name: 'sectionMenu',
                    kind: 'TSRR.Tables.SectionMenu'
                  }
                ]
              }
            ]
          }
        ]
      }, {
        classes: 'row',
        name: 'tables',
        components: []
      }
    ],
    initComponents: function() {
      return this.inherited(arguments);
    },
    init: function() {
      this.inherited(arguments);
      if ((window.localStorage.getItem('currentSection')) != null) {
        return this.loadTablesFromSection(new OB.Model.Section(JSON.parse(window.localStorage.getItem('currentSection'))));
      }
    },
    selectSection: function(inSender, inEvent) {
      var currentSection;
      currentSection = inEvent.originator.model;
      window.localStorage.setItem('currentSection', JSON.stringify(currentSection));
      return this.loadTablesFromSection(currentSection);
    },
    loadTablesFromSection: function(tsrrSection) {
      var criteria;
      this.$.caption.setContent(tsrrSection.get('name'));
      criteria = {
        tsrrSection: tsrrSection.id
      };
      return OB.Dal.find(OB.Model.Table, criteria, this.loadTables, this.dalError, this);
    },
    loadTables: function(tables, me) {
      var table, _i, _len, _ref;
      me.$.tables.destroyClientControls();
      _ref = tables.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        table = _ref[_i];
        me.loadTable.call(me, table);
      }
      return me.$.tables.render();
    },
    dalError: function(tx, error) {
      return OB.UTIL.showError("OBDAL error: " + error);
    },
    loadTable: function(table) {
      return this.$.tables.createComponent({
        kind: 'TSRR.Tables.TableItem',
        model: table
      });
    },
    selectTable: function(inSender, inEvent) {
      var bi, loadOrderStr, me;
      TSRR.Tables.Config.currentTable = inEvent.originator.model;
      window.localStorage.setItem('currentTable', JSON.stringify(inEvent.originator.model));
      me = this;
      me.currentTable = inEvent.originator.model;
      if (me.currentTable.bookingInfoList && me.currentTable.bookingInfoList.length > 0) {
        bi = me.currentTable.bookingInfoList.at(0);
        TSRR.Tables.Config.currentOrderId = bi.get('salesOrder');
        OB.POS.navigate('retail.pointofsale');
      } else {
        this.currentBusinessPartner = OB.POS.modelterminal.attributes.businessPartner;
        if (me.currentTable) {
          me.currentTable.setBusinessPartnerAndCreateOrder(this.currentBusinessPartner);
        }
        loadOrderStr = 'new sales order created for table ' + me.currentTable.name;
        if (loadOrderStr) {
          OB.UTIL.showAlert.display(loadOrderStr, OB.I18N.getLabel("OBPOS_Info"));
        }
        OB.POS.navigate('retail.pointofsale');
      }
    },
    changeBusinessPartner: function(inSender, inEvent) {
      this.currentBusinessPartner = inEvent.businessPartner;
      if (this.currentTable) {
        return this.currentTable.setBusinessPartnerAndCreateOrder(this.currentBusinessPartner);
      }
    },
    hideThisPopup: function(inSender, inEvent) {
      OB.info('hiding table window');
      return OB.POS.navigate('retail.pointofsale');
    },
    destroy: function() {
      return this.inherited(arguments);
    }
  });

  OB.POS.registerWindow({
    windowClass: TSRR.Tables.UI.Tables,
    route: 'retail.restaurantmode',
    menuPosition: 1,
    online: true,
    menuI18NLabel: "TSRR_LblRestaurants",
    permission: 'OBPOS_print.receipt'
  });

}).call(this);
