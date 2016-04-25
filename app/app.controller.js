"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$state', function ($scope, $rootScope, $location, AuthenticationService, $state) {
  $scope.curUrl = "";
  $scope.logout = function () {
    AuthenticationService.ClearCredentials();
    $state.go('login');
  };

}]);
