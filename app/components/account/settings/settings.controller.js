'use strict';

angular.module("app").controller('settingsCtrl', ['$rootScope', 'UserService', 'AuthenticationService','messagesFactory', '$timeout', 'settingsService', function ($rootScope, UserService, AuthenticationService, messagesFactory, $timeout, settingsService) {
  var settings = this;
  settings.model = {};
  settings.model.userData = angular.copy($rootScope.globals.currentUser);

  (function () {
    getNotificationData();
  })();

  settings.submitForm = function (form) {
    settings.submitted = true;
    if (form.$valid) {
      saveProfile();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function saveProfile() {

    var handleSuccess = function (data) {
      AuthenticationService.SetCredentials(settings.model.userData);
      messagesFactory.editprofileSuccessMessages(data);
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.forgotErrorMessages(status);
      }
    };
    settings.loadPromise = UserService.Update(settings.model.userData)
      .success(handleSuccess)
      .error(handleError);
  }


  settings.submitNotifications = function () {
    var handleSuccess = function (data) {
      flashService.showSuccess(data.message, true);
    };
    var handleError = function (error) {
      flashService.showError(error.error, false);
    };
    settings.loadPromise = settingsService.updateApi(settings.model.notificationObj)
      .success(handleSuccess)
      .error(handleError);
  };

  function getNotificationData() {
    var handleSuccess = function (data) {
      settings.model.notificationObj = data;
    };
    var handleError = function (error) {
      flashService.showError(error.error, false);
    };
    settings.loadPromise = settingsService.getApi()
      .success(handleSuccess)
      .error(handleError);
  }


}]);
