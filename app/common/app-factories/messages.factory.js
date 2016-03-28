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
    if (status === 412) {
      message = $translate.instant('user.validationMessages.email_registered');
    }
    else if (status === 500) {
      message = $translate.instant('user.validationMessages.password_strength ');
    }  else {
      message = $translate.instant('user.validationMessages.password_require ');
    }
    flashService.showError(message, false);
  }

  function forgotSuccessMessages(successObj) {
    if (successObj) {
      flashService.showCustomMessage('forgot', true);
    }
  }

  function forgotErrorMessages(status) {
    var message;
    if (status === 500) {
      message = $translate.instant('user.validationMessages.email_valid ');
    }
    flashService.showError(message, false);
  }
  function resetpasswordSuccessMessages(successObj) {
    if (successObj) {
      flashService.showCustomMessage("reset", true);
    }
  }
  function resetpasswordErrorMessages(status) {
    if (status === 500) {
      flashService.showError($translate.instant('user.validationMessages.error_reset_password '), false);
    }
  }

  function settingseditprofileSuccessMessages(successObj) {
    if (successObj) {
      flashService.showSuccess( $translate.instant('user.validationMessages.profile_edit_success '), true);
    }
  }

  function settingseditprofileErrorMessages(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('user.validationMessages.profile_edit_error '), false);
  }

  function settingschangepasswordSuccessMessages(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('user.validationMessages.password_change_new_login'), false);
    }
  }

  function settingschangepasswordErrorMessages(status) {
    var message;
      if (status === 500) {
        message = $translate.instant('user.validationMessages.old_passwpord_wrong');
    } else {
        message = $translate.instant('user.validationMessages.old_passwpord_require');
    }
    flashService.showError(message, false);
  }

  function settingsNotificationsSuccessMessages(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('user.validationMessages.nofifications_success_msg'), true);
    }
  }

  function settingsNotificationsErrorMessages(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('user.validationMessages.nofifications_error_msg'), false);
  }
  function settingsgetNotifictaionsErrorMessages(status){
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('user.validationMessages.nofifications_error_msg'), false);
  }
  function SettingsupadtemissinglettersErrorMessages(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('user.validationMessages.missing_letters_error'), false);
  }
  function SettingsupadtemissinglettersSuccessMessages(successObj){
    if (successObj) {
      flashService.showSuccess($translate.instant('user.validationMessages.missing_letters_updated'), true);

    }
  }
  function selectmissinglettesErrorMessages(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('user.validationMessages.missing_letters_error'), false);
  }



  service.loginErrorMessages = loginErrorMessages;
  service.registerErrorMessages = registerErrorMessages;
  service.registerSuccessMessages = registerSuccessMessages;
  service.forgotErrorMessages = forgotErrorMessages;
  service.forgotSuccessMessages = forgotSuccessMessages;
  service.resetpasswordSuccessMessages = resetpasswordSuccessMessages;
  service.resetpasswordErrorMessages = resetpasswordErrorMessages;
  service.settingseditprofileErrorMessages = settingseditprofileErrorMessages;
  service.settingseditprofileSuccessMessages = settingseditprofileSuccessMessages;
  service.settingschangepasswordSuccessMessages = settingschangepasswordSuccessMessages;
  service.settingschangepasswordErrorMessages = settingschangepasswordErrorMessages;
  service.settingsNotificationsSuccessMessages = settingsNotificationsSuccessMessages;
  service.settingsNotificationsErrorMessages = settingsNotificationsErrorMessages;
  service.settingsgetNotifictaionsErrorMessages = settingsgetNotifictaionsErrorMessages;
  service.SettingsupadtemissinglettersErrorMessages = SettingsupadtemissinglettersErrorMessages;
  service.SettingsupadtemissinglettersSuccessMessages = SettingsupadtemissinglettersSuccessMessages;
  service.selectmissinglettesErrorMessages = selectmissinglettesErrorMessages;

  return service;
}]);
