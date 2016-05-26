'use strict';

angular.module("app").controller('forgotPasswordCtrl', ['$scope', 'UserService', 'messagesFactory', '$state', function ($scope, UserService, messagesFactory, $state) {

  var forgot = this;
  forgot.model = {};
  forgot.service = UserService;

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
    var handleSuccess = function (data) {
      forgot.data = {};
      messagesFactory.forgotSuccessMessages(data);
      $state.go('messages', {data: forgot.model});
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.forgotErrorMessages(status);
      }
    };
    UserService.forgotPasswordAPI(forgot.model)
      .success(handleSuccess)
      .error(handleError);
  }
}]);
