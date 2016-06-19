"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$state', function ($scope, $rootScope, $location, AuthenticationService, $state) {
  $scope.curUrl = "";
  $scope.logout = function () {
    AuthenticationService.ClearCredentials();
    $state.go('login');
  };

  $scope.showLogoutBtn = function(){
    var currentUser = $rootScope.globals.currentUser;
    var currentUrl = $location.path();
    var showLogout = true;
    var restrictedURLS = ['/login', '/register', '/forgot-password','/user/confirmation','/messages'];
    for(var ind =0; restrictedURLS.length > ind; ind++){
      if(currentUrl.indexOf(restrictedURLS[ind]) > -1){
        showLogout = false;
      }
    }
    return showLogout && currentUser;
  }

}]);
