'use strict';

angular.module("app").controller('loginCtrl', ['$rootScope','$scope', '$state', 'AuthenticationService', 'flashService', '$timeout' , function ($rootScope, $scope, $state, AuthenticationService, flashService, $timeout ) {

	var login = this;
	login.model = {};

	(function initController() {
    AuthenticationService.ClearCredentials();
    login.model = AuthenticationService.getRememberMe();
  })();

	login.submitForm = function(form){
 		if (form.$valid || (login.model.email && login.model.password)) {
          loginAction();
          form.$setPristine();
      } else {
          $timeout(function() {
              angular.element('.custom-error:first').focus();
          }, 200);
      }
 	};

  function stuctureFormData (){
    var data = { };
    data.identifier = login.model.email;
    data.password = login.model.password;
    return data;
  }

  function loginAction(){
    var handleSuccess = function(data) {
        AuthenticationService.setRememberMe(login.model);
        AuthenticationService.SetCredentials(data, login.model);
        $state.go('account.dashboard');
    };
    var handleError = function(error) {
        flashService.Error(error.error, false);
    };
    AuthenticationService.loginApi(stuctureFormData())
        .success(handleSuccess)
        .error(handleError);
  }

}]);
