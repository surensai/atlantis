'use strict';
angular.module("app").directive('sideBar', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element) {
      element.bind('click', function () {
        angular.element(document.querySelector('#sidebar')).toggleClass('sidebar-toggle');
        angular.element(document.querySelector('body')).toggleClass('body-toggle');

      });
    }
  };
}]);
