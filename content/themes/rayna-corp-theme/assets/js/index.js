//var $postContent = $(".post-content");
//$postContent.fitVids();
//
;(function (ctx) {
  ctx.rayna = ctx.rayna || {};

  ctx.rayna.parseJSON = function parseJSON(response) { return response.json(); };
  ctx.rayna.checkStatus = function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    };

})(this);
