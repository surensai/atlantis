'use strict';

angular.module("app").controller('resetPasswordCtrl', ['$scope', 'UserService', '$state', '$timeout', 'flashService', 'auth', function ($scope, UserService, $state, $timeout, flashService, auth) {

  var resetPassword = this;
  resetPassword.model = {};

  (function () {
    if (auth.data.message !== "success") {
      flashService.Error("Your session has expired", true);
      $state.go('messages');
    }
  })();

  resetPassword.submitForm = function (form) {
    resetPassword.submitted = true;
    if (form.$valid) {
      save();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function save() {
    var handleSuccess = function (data) {
      resetPassword.data = {};
      $state.go('login');
      flashService.Success(data.message, true);
    };

    var handleError = function (error) {
      flashService.Error(error.error, false);
    };

    UserService.resetPasswordAPI(resetPassword.model, $state.params.token)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
