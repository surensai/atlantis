'use strict';

angular.module("app").controller('forgotPasswordCtrl', ['$scope','UserService','flashService', function ($scope, UserService,flashService) {

	var forgot = this;
	forgot.scope = $scope;
	forgot.data = {};
	forgot.model = {};
  forgot.service = UserService;
  forgot.scope.spinIt = false;

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
 	};

 	function stuctureFormData (){
      var data = { };
      data.email = forgot.data.email;
      return data;
  	}

  	function forgotAction(){

  		var formData = stuctureFormData();
      forgot.scope.spinIt = true;

      var handleSuccess = function (data) {
        forgot.data ={};
        forgot.scope.spinIt = false;
        flashService.Success(data.message, true);
      };

      var handleError = function (error) {
        forgot.scope.spinIt = false;
        flashService.Error(error.error, false);
      };

      forgot.service.forgotPasswordAPI(formData)
        .success(handleSuccess)
        .error(handleError);

   	}
}]);
