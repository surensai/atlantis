'use strict';

angular.module("app").controller('forgotPasswordCtrl', ['$scope','UserService','flashService', function ($scope, UserService,flashService) {

	var forgot = this;
	forgot.model = {};

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
      var handleSuccess = function (data) {
        forgot.data ={};
        flashService.Success(data.message, true);
      };
      var handleError = function (error) {
        flashService.Error(error.error, false);
      };
      UserService.forgotPasswordAPI(forgot.model)
        .success(handleSuccess)
        .error(handleError);
   	}
}]);
