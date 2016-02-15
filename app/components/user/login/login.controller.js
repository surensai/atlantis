'use strict';

angular.module("app").controller('loginCtrl', ['$scope', '$state', 'AuthenticationService', 'flashService', '$timeout', '$translate', function ($scope, $state, AuthenticationService, flashService, $timeout, $translate) {

  var login = this;
  login.model = {};

  (function () {
    AuthenticationService.ClearCredentials();
    login.model = AuthenticationService.getRememberMe();
  })();

  login.submitForm = function (form) {
    if (form.$valid || (login.model.email && login.model.password)) {
      loginAction();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function stuctureFormData() {
    var data = {};
    data.identifier = login.model.email;
    data.password = login.model.password;
    return data;
  }

  function loginAction() {
    var handleSuccess = function (data) {
      AuthenticationService.setRememberMe(login.model);
      AuthenticationService.SetCredentials(data, login.model);
      $state.go('account.dashboard');
    };
    var handleError = function (error, status) {
      var message;
      if (status === 424) {
        message = $translate.instant('user.validationMessages.Email_notverified');
      } else {
        message = $translate.instant('user.validationMessages.email_password_mismatch');
      }
      flashService.showError(message, false);
    };
    AuthenticationService.loginApi(stuctureFormData())
      .success(handleSuccess)
      .error(handleError);
  }

}]);
