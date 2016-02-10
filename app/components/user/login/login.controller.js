'use strict';

app.controller('loginCtrl', ['$rootScope','$scope', '$state', 'AuthenticationService', 'flashService', '$timeout' , function ($rootScope, $scope, $state, AuthenticationService, flashService, $timeout ) {

	var login = this;
	login.scope = $scope;
	login.data = {};
	login.model = {};
	login.service = AuthenticationService;

	(function initController() {
      login.service.ClearCredentials();
      login.data = login.service.getRememberMe();
  })();

	login.scope.submitForm = function(valid){
 		login.scope.submitted = true;
 		if (valid || (login.data.email && login.data.password)) {
          loginAction();
          login.scope.signinForm.$setPristine();
      } else {
          $timeout(function() {
              angular.element('.custom-error:first').focus();
          }, 200);
      }
 	};

  login.scope.rememberMe = function() {
      login.service.setRememberMe(login.data);
  };

 	function stuctureFormData (){
    var data = { };
    data.identifier = login.data.email;
    data.password = login.data.password;
    return data;
  }

  function loginAction(){
    var formData = stuctureFormData();

    var handleSuccess = function(data, status) {
        login.service.SetCredentials(data, formData);
        login.scope.signinForm.$valid = true;
        $state.go('account.dashboard');
    };

    var handleError = function(error) {
        flashService.Error(error.error, false);
    };

    login.service.loginApi(formData)
        .success(handleSuccess)
        .error(handleError);
  }



}]);
