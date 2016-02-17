'use strict';
angular.module("app").directive('twitterShare', [ function () {
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


