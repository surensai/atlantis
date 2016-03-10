'use strict';
angular.module('app').factory('appService', [ function () {
  var service = {};

  service.isFooterFixed = function(paht){
    var pages = ['/progress'];
    var isFooterFixed = $.inArray(paht, pages) !== -1;
    if (isFooterFixed) {
      return true;
    } else {
      return false;
    }
  };

  return service;

}]);
