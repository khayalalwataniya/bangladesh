(function() {
  enyo.kind({
    name: "OB.UI.OrderHeader",
    classes: "row-fluid span12",
    published: {
      order: null
    },
    style: "border-bottom: 1px solid #cccccc;",
    components: [
      {
        components: [
          {
            kind: "OB.UI.OrderDetails",
            name: "orderdetails"
          }, {
            kind: "TSRR.UI.OrderDetailsSectionTable",
            name: "orderdetailssectiontable"
          }
        ]
      }, {
        components: [
          {
            kind: "OB.UI.BusinessPartner",
            name: "bpbutton"
          }, {
            kind: "OB.UI.BPLocation",
            name: "bplocbutton"
          }
        ]
      }
    ],
    orderChanged: function(oldValue) {
      this.$.bpbutton.setOrder(this.order);
      this.$.bplocbutton.setOrder(this.order);
      this.$.orderdetails.setOrder(this.order);
      this.$.orderdetailssectiontable.setOrder(this.order);
    }
  });

  enyo.kind({
    name: "TSRR.UI.OrderDetailsSectionTable",
    published: {
      order: null
    },
    components: [
      {
        kind: "Signals",
        onCurrentTableSet: "currentTableSet"
      }
    ],
    attributes: {
      style: "margin-left: 10px; font-weight: bold; color: #6CB33F;"
    },
    renderData: function() {
      var me, sectionName, sectionTable, tableName;
      me = this;
      sectionTable = me.content;
      sectionName = JSON.parse(localStorage.getItem('currentSection')).name;
      if (me.content.indexOf(sectionName) === -1) {
        sectionTable = sectionName + ' - ';
      }
      if (TSRR.Tables.Config.currentOrder) {
        tableName = TSRR.Tables.Config.currentOrder.get('restaurantTable').name;
        if (me.content.indexOf(tableName) === -1) {
          sectionTable = sectionTable + tableName;
        }
      }
      me.setContent(sectionTable);
    },
    currentTableSet: function(inEvent, inParam) {
      this.renderData();
    },
    orderChanged: function() {
      this.renderData();
    }
  });

}).call(this);
