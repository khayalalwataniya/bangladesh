(function() {
  OB.Model.Product.addProperties([
    {
      name: "weight",
      column: "weight",
      primaryKey: false,
      filter: false,
      type: "NUMERIC"
    }, {
      name: "attributeSet",
      column: "attributeSet",
      type: "TEXT"
    }
  ]);

}).call(this);
