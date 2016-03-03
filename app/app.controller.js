"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$state', function ($scope, $rootScope, $location, AuthenticationService, $state) {
  $scope.curUrl = "";
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

  $rootScope.$on('$locationChangeStart', function () {
    $scope.curUrl =$location.path();
  });

}]);
