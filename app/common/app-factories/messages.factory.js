'use strict';
angular.module('app').factory('messagesFactory', ['$translate', 'flashService', 'appService', '$uibModal', '$state', function ($translate, flashService, appService, $uibModal, $state) {

  var service = {};

  function netWorkError() {
    appService.handleOffline($uibModal, $state, true);
  };
  
  
  service.successSample = function (successObj) {
    if (successObj) {
      flashService.showSuccess($translate.instant("player.messages.edit_player_success"), true);
    }
  };
  
  service.customMessagesSample = function (successObj) {
    if (successObj) {
      flashService.showCustomMessage('forgot', true);
    }
  };
  
  service.showErrorSample = function (status) {
    flashService.showError(message, false);
  };

  return service;
}]);
