'use strict';
angular.module("app").directive('sideBar', ['$timeout','AuthenticationService', '$state', function ($timeout, AuthenticationService, $state) {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element) {
      $timeout(function () {
        element.bind('click', function () {
          angular.element(document.querySelector('#sidebar')).toggleClass('sidebar-toggle');
          angular.element(document.querySelector('.slidebar-overlay')).toggleClass('slide-overlay-toggle');
          angular.element(document.querySelector('body')).toggleClass('body-toggle');
        });

        angular.element(document.querySelector('#side-bar-logout')).bind('click', function () {
          AuthenticationService.ClearCredentials();
          $state.go("login");
        });
      });
    }
  };
}]);
