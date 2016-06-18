'use strict';

angular.module("app").controller('loginCtrl', ['$state', 'AuthenticationService', '$timeout', 'UserService', 'messagesFactory','appService', function ($state, AuthenticationService, $timeout, UserService, messagesFactory, appService) {

  var login = this;
  login.model = {};
  login.showResendOption = false;

  (function () {
    if(appService.checkSessionOnURLChange()){
      $state.go('account.dashboard');
    }
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

  login.onResendEmail = function () {
    var handleSuccess = function (data) {
      messagesFactory.registerSuccessMessages(data);
      $state.go('messages', {data: {"email": login.model.email}});
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.forgotErrorMessages(status);
      }
    };

    UserService.resendActivationEmailAPI({"email": login.model.email})
      .success(handleSuccess)
      .error(handleError);
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

      if (error && status) {
        login.showResendOption = (status === 410) ? true : false ;
        login.model.password = '';
        messagesFactory.loginErrorMessages(status);

      }
    };
    AuthenticationService.loginApi(stuctureFormData())
      .success(handleSuccess)
      .error(handleError);
  }

}]);
