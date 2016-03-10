'use strict';

angular.module("app").controller('settingsCtrl', ['$rootScope', 'UserService', 'AuthenticationService', 'messagesFactory', '$timeout', 'settingsService', '$state', function ($rootScope, UserService, AuthenticationService, messagesFactory, $timeout, settingsService, $state) {
  var settings = this;
  settings.model = {};
  settings.model.userData = angular.copy($rootScope.globals.currentUser);
  settings.isEditClicked = false;

  settings.edit = function () {
    settings.model.userData = angular.copy($rootScope.globals.currentUser);
    settings.isEditClicked = true;
  };

  settings.cancel = function () {
    settings.model.userData = $rootScope.globals.currentUser;
    settings.isEditClicked = false;
  };

  (function () {
    getNotificationData();
  })();
  settings.closeAlert = function () {
    settings.show = false;
  };
  settings.submitForm = function (form) {
    settings.submitted = true;
    settings.show = true;
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
      settings.isEditClicked = false;
      AuthenticationService.SetCredentials(settings.model.userData);
      messagesFactory.settingseditprofileSuccessMessages(data);
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingseditprofileErrorMessages(status);
      }
    };
    settings.loadPromise = UserService.Update(settings.model.userData)
      .success(handleSuccess)
      .error(handleError);
  }

  settings.submitchangepassword = function (form) {
    settings.submitted = true;
    settings.show = true;
    if (form.$valid && (settings.model.userData.password === settings.model.userData.confirmPassword)) {
      changePassword();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  };

  function changePassword() {
    var handleSuccess = function (data) {
      AuthenticationService.ClearCredentials(settings.model.userData);
      messagesFactory.settingschangepasswordSuccessMessages(data);
      $state.go('messages');
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingschangepasswordErrorMessages(status);
      }
    };
    settings.loadPromise = UserService.changePasswordAPI(settings.model.userData)
      .success(handleSuccess)
      .error(handleError);
  }


  settings.submitNotifications = function () {
    settings.show = true;
    var handleSuccess = function (data) {
      messagesFactory.settingsNotificationsSuccessMessages(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingsNotificationsErrorMessages(status);
      }
    };
    settings.loadPromise = settingsService.updateApi(settings.model.notificationObj)
      .success(handleSuccess)
      .error(handleError);
  };

  function getNotificationData() {
    var handleSuccess = function (data) {
      settings.model.notificationObj = data;
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingsgetNotifictaionsErrorMessages(status);
      }
    };
    settings.loadPromise = settingsService.getApi()
      .success(handleSuccess)
      .error(handleError);
  }

}]);
