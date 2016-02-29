"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$translate', 'AuthenticationService', '$state', function ($scope, $rootScope, $translate, AuthenticationService, $state) {

  $scope.logout = function () {
    AuthenticationService.ClearCredentials();
    $state.go('login');
  };

  $scope.headerLogoNavigation = function () {
    var loggedIn = $rootScope.globals.currentUser;
    if (!loggedIn) {
      $state.go('login');
    }
    else {
      $state.go('account.dashboard');
    }
  };

}]);
