(function() {
  $(document).ready(function() {
    var imageUrl;
    window.s = $(".enyo-body-fit");
    imageUrl = "../com.tasawr.retail.restaurant/images/linen_bg_tile.jpg";
    return $(".enyo-body-fit").css("background-image", "url(" + imageUrl + ")");
  });
}).call(this);
