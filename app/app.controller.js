"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$state','appService', function ($scope, $rootScope, $location, AuthenticationService, $state, appService) {
  $scope.curUrl = "";
  $scope.logout = function () {
    AuthenticationService.ClearCredentials();
    $state.go('login');
  };

  $rootScope.$on('$locationChangeStart', function () {
    $scope.curUrl = $location.path();
    $scope.isFooterFixed = appService.isFooterFixed($scope.curUrl);
  });

}]);
