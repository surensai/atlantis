'use strict';

angular.module("app").controller('changePasswordCtrl', ['UserService', '$timeout', 'flashService', 'AuthenticationService', '$state','$translate', function (UserService, $timeout, flashService, AuthenticationService, $state, $translate) {

  var changePassword = this;
  changePassword.model = {};

  changePassword.closeAlert = function(index) {
    changePassword.show = false;
  };


  changePassword.submitForm = function (form) {
    changePassword.submitted = true;

    if (form.$valid && changePassword.model.password == changePassword.model.confirmPassword) {

      changePassword.show = true;
      if (form.$valid) {

        save();
        form.$setPristine();
      } else {
        $timeout(function () {
          angular.element('.custom-error:first').focus();
        }, 200);
      }
    };
  };

  function save() {
    var handleSuccess = function () {
      var message = $translate.instant('user.validationMessages.password_change_new_login');
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
