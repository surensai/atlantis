'use strict';

angular.module("app").controller('forgotPasswordCtrl', ['$scope','UserService','flashService', function ($scope, UserService,flashService) {

	var forgot = this;
	forgot.model = {};
  forgot.service = UserService;
  forgot.scope.spinIt = false;

	forgot.submitForm = function(form){
 		if (form.$valid) {
        forgotAction();
        form.$setPristine();
      } else {
          $scope.timeout(function() {
              angular.element('.custom-error:first').focus();
          }, 200);
      }
 	};

  function forgotAction(){
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
      UserService.forgotPasswordAPI(forgot.model)
        .success(handleSuccess)
        .error(handleError);
   	}
}]);
