'use strict';

angular.module("app").controller('forgotPasswordCtrl', ['$scope', 'UserService', 'flashService', function ($scope, UserService, flashService) {

  var forgot = this;
  forgot.model = {};
  forgot.service = UserService;
  forgot.spinIt = false;

  forgot.submitForm = function (form) {
    if (form.$valid) {
      forgotAction();
      form.$setPristine();
    } else {
      $scope.timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function forgotAction() {
    forgot.spinIt = true;
    var handleSuccess = function (data) {
      forgot.data = {};
      forgot.spinIt = false;
      flashService.showSuccess(data.message, true);
    };
    var handleError = function (error) {
      forgot.spinIt = false;
      flashService.showError(error.error, false);
    };
    UserService.forgotPasswordAPI(forgot.model)
      .success(handleSuccess)
      .error(handleError);
  }
}]);
