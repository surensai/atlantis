'use strict';

angular.module("app").controller('changePasswordCtrl', ['UserService', '$timeout', 'flashService', 'AuthenticationService', '$state',function (UserService, $timeout, flashService, AuthenticationService, $state) {

  var changePassword = this;
  changePassword.model = {};

  changePassword.submitForm = function (form) {
    changePassword.submitted = true;
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
      AuthenticationService.ClearCredentials();
      var message = "Your password has changed. Please try to login"
      flashService.showSuccess(message, true);
      $state.go('login');
    };
    var handleError = function (error) {
      flashService.showError(error.error, false);
    };
    changePassword.loadPromise = UserService.changePasswordAPI(changePassword.model)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
