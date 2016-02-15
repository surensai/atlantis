"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$translate', 'AuthenticationService', '$state', function ($scope, $rootScope, $translate, AuthenticationService, $state) {

  $scope.logout = function () {
    AuthenticationService.ClearCredentials();
    $state.go('login');
  };

}]);
