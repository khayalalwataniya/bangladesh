(function() {
  enyo.kind({
    name: 'TSRR.Tables.WebPOSComponent',
    kind: 'OB.UI.Button',
    classes: 'btnlink btnlink-toolbar webpos-table empty',
    components: [
      {
        name: 'label',
        classes: 'label',
        content: '',
        tag: 'h4'
      }, {
        tag: 'div',
        classes: 'btn-icon icon'
      }, {
        name: 'amount',
        classes: 'text important amount',
        content: '',
        allowHtml: true,
        tag: 'p'
      }, {
        name: 'chairs',
        classes: 'text chairs',
        content: '',
        allowHtml: true,
        tag: 'p'
      }, {
        name: 'orderCount',
        classes: 'text orderCount',
        content: '',
        allowHtml: true,
        tag: 'p'
      }, {
        name: 'locker',
        classes: 'text locker hidden',
        content: '',
        tag: 'p'
      }, {
        kind: "Group",
        tag: null,
        defaultKind: "onyx.IconButton",
        components: [
          {
            name: 'lockIcon',
            src: "../../web/com.tasawr.retail.restaurant/images/unlock.png"
          }, {
            name: 'bookingIcon',
            src: "../../web/com.tasawr.retail.restaurant/images/waiter-w.png"
          }, {
            name: 'smokingIcon',
            src: "../../web/com.tasawr.retail.restaurant/images/no_smoking.png"
          }
        ]
      }
    ],
    published: {
      isEmpty: true,
      currentOrder: null
    },
    create: function() {
      return this.inherited(arguments);
    },
    setLocker: function(locker) {
      this.$.locker.setContent(locker);
      return this.$.lockIcon.setSrc('../../web/com.tasawr.retail.restaurant/images/lock.png');
    },
    setChairs: function(chairs) {
      return this.$.chairs.setContent('Chairs: <span class="badge">' + chairs + '</span>');
    },
    setOrderCount: function(orderCount) {
      return this.$.orderCount.setContent('Orders: <span class="badge">' + orderCount + '</span>');
    },
    setLabel: function(label) {
      return this.$.label.setContent(label);
    },
    setAmount: function(amount) {
      this.$.amount.setContent(OB.POS.modelterminal.get('currency')._identifier + ' <span class="badge">' + amount.toFixed(2) + '</span> ');
      if (amount !== 0) {
        return this.$.bookingIcon.setSrc('../../web/com.tasawr.retail.restaurant/images/waiter.png');
      }
    },
    setSmoking: function(smoking) {
      if (smoking === 'Smoking') {
        return this.$.smokingIcon.setSrc('../../web/com.tasawr.retail.restaurant/images/smoking.png');
      }
    },
    isEmptyChanged: function(inOldValue) {
      if (this.isEmpty) {
        return this.addClass('empty');
      } else {
        return this.removeClass('empty');
      }
    }
  });

  enyo.kind({
    name: 'TSRR.Buttons.Attributes',
    kind: 'OB.UI.Button',
    classes: 'empty enyo-tool-decorator btnselect',
    components: [
      {
        name: 'Attribute'
      }
    ],
    create: function() {
      this.inherited(arguments);
      return this.$.Attribute.setContent(this.model);
    },
    tap: function(inSender, inEvent) {
      console.info(this.model);
      console.info(this.attribs.attributeName);
      if (this.attribs.attributeName) {
        localStorage.setItem('productAttribute_' + this.attribs.attributeName, this.model.trim());
      }
      _.each(this.parent.children, function(child) {
        child.removeClass('attribute');
        return child.addClass('empty');
      });
      if (this.getClassAttribute().match(/empty/).length > 0) {
        this.removeClass('empty');
        return this.addClass('attribute');
      }
    }
  });

}).call(this);
