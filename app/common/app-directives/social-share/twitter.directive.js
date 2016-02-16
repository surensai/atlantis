'use strict';
angular.module("app").directive('twitterShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    link: function () {
    }
  };
}]);


