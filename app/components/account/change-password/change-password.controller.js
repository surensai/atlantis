'use strict';

angular.module("app").controller('changePasswordCtrl', ['UserService', '$timeout', 'flashService', 'AuthenticationService', '$state','$translate','messagesFactory', function (UserService, $timeout, flashService, AuthenticationService, $state, $translate,messagesFactory) {

  var changePassword = this;
  changePassword.model = {};

  changePassword.closeAlert = function() {
    changePassword.show = false;
  };


  changePassword.submitForm = function (form) {
    changePassword.submitted = true;

    if (form.$valid && changePassword.model.password === changePassword.model.confirmPassword) {

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
    var handleSuccess = function (data) {
      AuthenticationService.ClearCredentials();
      messagesFactory.changepasswordSuccessMessages(data);
      $state.go('messages');
    };
    var handleError = function (error,status) {
      if (error && status) {
        changePassword.show = true;
        messagesFactory.changepasswordErrorMessages(status);
      }
    };
    changePassword.loadPromise = UserService.changePasswordAPI(changePassword.model)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
