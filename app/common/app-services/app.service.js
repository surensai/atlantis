'use strict';
angular.module('app').factory('appService', [ '$rootScope','$timeout', function ($rootScope, $timeout) {
  var service = {};

  /**
   * Offline Manage
   * @param  {String}   url
   * @param  {Function} callback
   * @param  {String}   [outputFormat=image/png]
   */

  service.handleOffline = function(){

    function updateOnlineStatus(event) {
      var condition = navigator.onLine ? "online" : "offline";
      alert(condition);
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  };

  service.isFooterFixed = function(){
    (function($) {
      $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
      };
    })(jQuery);

    $timeout(function() {
      $rootScope.isFooterFix = $('body').hasScrollBar();
    }, 200);
  };

  return service;

}]);
