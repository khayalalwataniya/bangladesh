(function() {
  var _this = this;

  enyo.kind({
    name: 'TSRR.Tables.SectionMenuItem',
    kind: 'OB.UI.MenuAction',
    events: {
      onSelectSection: ''
    },
    initComponents: function() {
      this.label = this.model.get('name');
      return this.inherited(arguments);
    },
    tap: function(inSender, inEvent) {
      if (this.disabled) {
        true;
      }
      this.parent.hide();
      return this.bubble('onSelectSection');
    }
  });

  enyo.kind({
    name: 'TSRR.Tables.SectionMenu',
    icon: 'btn-icon btn-icon-menu',
    components: [
      {
        kind: 'onyx.MenuDecorator',
        name: 'btnContextMenu',
        components: [
          {
            kind: 'OB.UI.ButtonContextMenu',
            name: 'toolbarButton'
          }, {
            kind: 'onyx.Menu',
            classes: 'dropdown',
            name: 'menu',
            maxHeight: 600,
            scrolling: false,
            floating: true
          }
        ]
      }
    ],
    onButtonTap: function() {
      if (this.$.toolbarButton.hasClass('btn-over')) {
        return this.$.toolbarButton.removeClass('btn-over');
      }
    },
    initComponents: function() {
      return this.inherited(arguments);
    },
    init: function(model) {
      this.inherited(arguments);
      this.model = model;
      return this.model.sections.on('reset', this.renderAll, this);
    },
    dalError: function(tx, error) {
      return OB.UTIL.showError("OBDAL error: " + error);
    },
    renderAll: function(sections) {
      var section, _i, _len, _ref, _results;
      _ref = sections.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this.renderOne(section));
      }
      return _results;
    },
    renderOne: function(section) {
      return this.$.menu.createComponent({
        kind: 'TSRR.Tables.SectionMenuItem',
        model: section
      });
    },
    destory: function() {
      this.model.sections.off('reset');
      return this.inherited(arguments);
    }
  });

}).call(this);
