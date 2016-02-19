'use strict';

angular.module("app").controller('forgotPasswordCtrl', ['$scope', 'UserService', 'flashService', 'messagesFactory', function ($scope, UserService, flashService, messagesFactory) {

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
      messagesFactory.forgotSuccessMessages(data);
    };
    var handleError = function (error, status) {
      forgot.spinIt = false;
      if (error && status) {
        messagesFactory.forgotErrorMessages(status);
      }
    };
    UserService.forgotPasswordAPI(forgot.model)
      .success(handleSuccess)
      .error(handleError);
  }
}]);
