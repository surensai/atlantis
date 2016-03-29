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
  function MissingLettersErrorMessages(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('user.validationMessages.missing_letters_error'), false);
  }
  function MissingLettersSuccessMessages(successObj){
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
  function customisesearchwordError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_words"), false);
  }

  function submitGroupwordsSuccess(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('user.validationMessages.groupword_success_msg'), true);
    }
  }
  function submitGroupwordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("user.validationMessages.error_group_words"), false);
  }
  function deletewordSuccess(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant("curriculum.message.delete_success"), true);
    }
  }
  function deletewordError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.message.error_deleting_word"), false);
  }
  function listwordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_words"), false);
  }
  function getGroupwordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_words"), false);
  }
  function searchwordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_words"), false);
  }
  function getwordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_players"), false);
  }
  function savewordsSuccess(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('user.validationMessages.word_success_msg'), true);
    }
  }
  function savewordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.invalid_word_deatils"), false);
  }
  function updatewordSuccess(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('user.validationMessages.word_update_msg'), true);
    }
  }
  function updatewordsError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.invalid_credentials"), false);
  }
  function uploadfileError(status) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError("Error in file uploading", false);
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
  service.MissingLettersErrorMessages = MissingLettersErrorMessages;
  service.MissingLettersSuccessMessages = MissingLettersSuccessMessages;
  service.selectmissinglettesErrorMessages = selectmissinglettesErrorMessages;
  service.customisesearchwordError =  customisesearchwordError;
  service.submitGroupwordsSuccess = submitGroupwordsSuccess;
  service.submitGroupwordsError = submitGroupwordsError;
  service.deletewordSuccess = deletewordSuccess;
  service.deletewordError = deletewordError;
  service.listwordsError = listwordsError;
  service.getGroupwordsError = getGroupwordsError;
  service.searchwordsError = searchwordsError;
  service.getwordsError = getwordsError;
  service.savewordsSuccess = savewordsSuccess;
  service.savewordsError = savewordsError;
  service.updatewordSuccess = updatewordSuccess;
  service.updatewordsError = updatewordsError;
  service.uploadfileError = uploadfileError;
  return service;
}]);
