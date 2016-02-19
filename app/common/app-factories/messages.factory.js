'use strict';
angular.module('app').factory('messagesFactory', ['$translate', 'flashService', function ($translate, flashService) {

  var service = {};

  function loginErrorMessages(status) {
    var message;
    if (status === 424) {
      message = $translate.instant('user.validationMessages.email_notverified');
    } else {
      message = $translate.instant('user.validationMessages.email_password_mismatch');
    }
    flashService.showError(message, false);
  }

  function registerSuccessMessages(successObj) {
    if (successObj) {
      flashService.showCustomMessage("register", true);
    }
  }

  function registerErrorMessages(status) {
    var message;
    if (status === 400) {
      message = $translate.instant('user.validationMessages.password_strength ');
    } else if (status === 500) {
      message = $translate.instant('user.validationMessages.email_registered');
    } else {
      message = $translate.instant('user.validationMessages.password_require ');
    }
    flashService.showError(message, false);
  }

  function forgotSuccessMessages(successObj) {
    if (successObj) {
      flashService.showSuccess(successObj.message, true);
    }
  }

  function forgotErrorMessages(status) {
    var message;
    if (status === 500) {
      message = $translate.instant('user.validationMessages.email_valid ');
    }
    flashService.showError(message, false);
  }

  function editprofileSuccessMessages(successObj) {
    if (successObj) {
      flashService.showSuccess(successObj.message, true);
    }
  }

  function editprofileErrorMessages(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError(message, false);
  }

  service.loginErrorMessages = loginErrorMessages;
  service.registerErrorMessages = registerErrorMessages;
  service.registerSuccessMessages = registerSuccessMessages;
  service.forgotErrorMessages = forgotErrorMessages;
  service.forgotSuccessMessages = forgotSuccessMessages;
  service.editprofileErrorMessages = forgotErrorMessages;
  service.editprofileSuccessMessages = editprofileSuccessMessages;
  return service;
}]);
