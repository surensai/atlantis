'use strict';

app.controller('forgotPasswordCtrl', ['$scope','UserService','flashService', function ($scope, UserService,flashService) {

	var forgot = this;
	forgot.scope = $scope;
	forgot.data = {};
	forgot.model = {};
  forgot.service = UserService;

	forgot.scope.submitForm = function(){
 		forgot.scope.submitted = true;
 		if (forgot.scope.signinForm.$valid) {
          forgotAction();
          forgot.scope.signinForm.$setPristine();
      } else {
          forgot.scope.timeout(function() {
              angular.element('.custom-error:first').focus();
          }, 200);
      }
 	}

 	function stuctureFormData (){
      var data = { };
      data.email = forgot.data.email;
      return data;
  	}

  	function forgotAction(){

  		var formData = stuctureFormData();

      var handleSuccess = function (data) {
        forgot.data ={};
        flashService.Success(data.message, true);
      };

      var handleError = function (error) {
        flashService.Error(error.error, false);
      };

      forgot.service.forgotPasswordAPI(formData)
        .success(handleSuccess)
        .error(handleError);

   	}
}]);
