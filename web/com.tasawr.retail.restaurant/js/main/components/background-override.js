(function() {
  var lineStatusChangePossible;

  $(document).ready(function() {
    var imageUrl;
    window.s = $(".enyo-body-fit");
    imageUrl = "../com.tasawr.retail.restaurant/images/linen_bg_tile.jpg";
    return $(".enyo-body-fit").css("background-image", "url(" + imageUrl + ")");
  });

  lineStatusChangePossible = function(line, newStatus) {
    var currentStatus;
    currentStatus = localStorage.getItem(line.cid);
    if (currentStatus === 'Not sent' && newStatus === 'send') {
      return true;
    } else if (currentStatus === 'sent' && newStatus === 'hold' || 'cancel') {
      return true;
    } else if (currentStatus === 'held' && newStatus === 'cancelled' || 'fired') {
      return true;
    } else if (currentStatus === 'cancelled' && newStatus === 'send') {
      return true;
    } else {
      return false;
    }
  };

}).call(this);
