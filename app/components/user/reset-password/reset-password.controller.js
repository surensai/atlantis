'use strict';

angular.module("app").controller('resetPasswordCtrl', ['$scope', 'UserService', '$state', '$timeout', 'flashService', 'auth', function ($scope, UserService, $state, $timeout, flashService, auth) {

  var resetPassword = this;
  resetPassword.model = {};

  (function () {
    if (auth.data.message !== "success") {
      flashService.showError("Your session has expired", true);
      $state.go('messages');
    }
  })();

  resetPassword.closeAlert = function() {
    resetPassword.show = false;
  };

  resetPassword.submitForm = function (form) {
    resetPassword.submitted = true;
    if (form.$valid && resetPassword.model.password === resetPassword.model.confirmPassword) {
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
      resetPassword.show = true;
      $state.go('login');
      flashService.showSuccess(data.message, true);
    };

    var handleError = function (error) {
      resetPassword.show = true;
      flashService.showError(error.error, false);
    };

    UserService.resetPasswordAPI(resetPassword.model, $state.params.token)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
