'use strict';
angular.module('app').factory('appService', [ '$rootScope', function ($rootScope) {
  var service = {};

  service.isFooterFixed = function(paht){
    var pages = ['/progress'];
    return $.inArray(paht, pages) !== -1;
  };

  /**
   * Convert an image
   * to a base64 url
   * @param  {String}   url
   * @param  {Function} callback
   * @param  {String}   [outputFormat=image/png]
   */

  service.convertImgToBase64URL = function(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  };

  service.isFooterFixed = function(){
    (function($) {
      $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
      };
    })(jQuery);

    $rootScope.isFooterFix = $('body').hasScrollBar();

  };

  return service;

}]);
