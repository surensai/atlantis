'use strict';
angular.module('app').factory('messagesFactory', ['$translate', 'flashService','appService','$uibModal','$state', function ($translate, flashService, appService, $uibModal, $state) {

  var service = {};


  function netWorkError (){
    appService.handleOffline($uibModal, $state, true);
  };

  service.loginErrorMessages = function(status) {
    var message;
    if (status === 424) {
      message = $translate.instant('user.validationMessages.email_notverified');
    } else {
      message = $translate.instant('user.validationMessages.email_password_mismatch');
    }
    flashService.showError(message, false);
  };

  service.registerSuccessMessages = function(successObj) {
    if (successObj) {
      flashService.showCustomMessage("register", true);
    }
  };

  service.registerErrorMessages = function(status) {
    var message;
    if (status === 412) {
      message = $translate.instant('user.register.messages.email_registered');
    }
    if (status === 400) {
      message = $translate.instant('user.validationMessages.email_valid');
    }
     if (status === 500) {
      message = $translate.instant('user.validationMessages.password_strength ');
    }
    flashService.showError(message, false);
  };

  service.forgotSuccessMessages = function(successObj) {
    if (successObj) {
      flashService.showCustomMessage('forgot', true);
    }
  };

  service.forgotErrorMessages = function(status) {
    var message;
    if (status === 500) {
      message = $translate.instant('user.validationMessages.email_valid ');
    }
    flashService.showError(message, false);
  };

  service.resetpasswordSuccessMessages = function(successObj) {
    if (successObj) {
      flashService.showCustomMessage("reset", true);
    }
  };

  service.resetpasswordErrorMessages = function(status) {
    if (status === 500) {
      flashService.showError($translate.instant('user.validationMessages.error_reset_password '), false);
    }
  };

  service.dashboardfeedsError = function(status,error) {
    if (status === -1) {
      netWorkError();
    }else{
      flashService.showError($translate.instant("dashboard.messages.error_get_feeds"), false);
    }
  };



  service.settingseditprofileSuccessMessages = function(successObj) {
    if (successObj) {
      flashService.showSuccess( $translate.instant('settings.messages.profile_edit_success '), true);
    }
  };

  service.settingseditprofileErrorMessages = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('settings.messages.profile_edit_error '), false);
  };

  service.settingschangepasswordSuccessMessages = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('settings.messages.password_change_new_login'), false);
    }
  };

  service.settingschangepasswordErrorMessages = function(status) {
    var message;
      if (status === 500) {
        message = $translate.instant('settings.messages.old_passwpord_wrong');
    } else {
        message = $translate.instant('user.validationMessages.old_passwpord_require');
    }
    flashService.showError(message, false);
  };

  service.settingsNotificationsSuccessMessages = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('settings.messages.nofifications_success_msg'), true);
    }
  };

  service.settingsNotificationsErrorMessages = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;

    }
    flashService.showError($translate.instant('settings.messages.nofifications_error_msg'), false);
  };

  service.settingsgetNotifictaionsErrorMessages = function(status,error){
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('settings.messages.nofifications_error_msg'), false);
  };

  service.updateMissingLettersErrorMessages = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('settings.messages.missing_letters_error'), false);
  };

  service.updateMissingLettersSuccessMessages = function(successObj){
    if (successObj) {
      flashService.showSuccess($translate.instant('settings.messages.missing_letters_updated'), false);

    }
  };

  service.selectmissinglettesErrorMessages = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant('settings.messages.missing_letters_error'), false);
  };

  service.customisesearchwordError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_getting_custom_words"), false);
  };

  service.submitGroupwordsSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('curriculum.messages.groupword_success_msg'), false);
    }
  };

  service.submitGroupwordsError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_group_words"), false);
  };

  service.deletewordSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant("curriculum.messages.delete_success"), true);
    }
  };

  service.deletewordError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_deleting_word"), false);
  };

  service.listwordsError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_getting_words"), false);
  };

  service.getGroupwordsError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_getting_words"), false);
  };

  service.searchwordsError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_getting_words"), false);
  };

  service.getwordsError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.error_getting_players"), false);
  };

  service.savewordsSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('curriculum.messages.word_success_msg'), false);
    }
  };

  service.savewordsError = function(status,error) {
    var message;
    if (status !== "" && error) {
      message = error.error;
    }
    flashService.showError($translate.instant("curriculum.messages.word_already_exist"), false);
  };

  service.updatewordSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('curriculum.messages.word_update_msg'), false);
    }
  };

  service.updatewordsError = function(status) {
    if (status === 500) {
   flashService.showError($translate.instant('curriculum.messages.exit_custom_word'), false);
    }
    else{
      flashService.showError($translate.instant("curriculum.messages.error_adding_word"), false);
    }
  };

  service.uploadfileError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_file_upload"), false);
  };



  service.firmwarecreateError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("admin.messages.invalid_firmware"), false);
  };

  service.firmwareuploadError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("admin.messages.firmware_upload_error"), false);
  };

  service.firmwarecreateSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant('admin.messages.firmware_success'), true);
    }
  };

  service.getPlayersError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_players"), false);
  };

  service.getPlayerwordsError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_words"), false);
  };

  service.createPlayerSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant("player.messages.add_success"), true);
    }
  };

  service.createPlayerError = function( ) {

    flashService.showError($translate.instant("player.messages.invalid_credentials"), false);
  };

  service.updatePlayerSuccess = function(successObj) {

    if (successObj) {
      flashService.showSuccess($translate.instant("player.messages.edit_player_success"), true);
    }
  };

  service.updatePlayerError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.invalid_credentials"), false);
  };

  service.deletePlayerSuccess = function(successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant("player.messages.delete_success"), true);
    }
  };

  service.deletePlayerError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_deleting_players"), false);
  };

  service.getPlayerbyIDError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_players"), false);
  };

  service.getminibadgessError = function(status,error) {
    var message;
    if (status !== "") {
      message = error.error;
    }
    flashService.showError($translate.instant("player.messages.error_getting_minibadges"), false);
  };

  return service;
}]);
