"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$state','appService', function ($scope, $rootScope, $location, AuthenticationService, $state, appService) {
  $scope.curUrl = "";
  $scope.logout = function () {
    AuthenticationService.ClearCredentials();
    $state.go('login');
  };

}]);
