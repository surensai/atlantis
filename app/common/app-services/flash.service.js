'use strict';

angular.module('app').factory('flashService', ['$rootScope','$cookieStore', function ($rootScope, $cookieStore) {

  var service = {};

  function initService() {
    $rootScope.$on('$locationChangeStart', function () {
      clearFlashMessage();
    });

    function clearFlashMessage() {
      var flash = $rootScope.globals.flash;
      if (flash) {
        if (!flash.keepAfterLocationChange && !flash.isClear) {
          delete $rootScope.globals.flash;
        } else {
          // only keep for a single location change
          flash.keepAfterLocationChange = false;
        }
      }
    }
  }

  function showSuccess(message, keepAfterLocationChange, isClear) {
    $rootScope.globals.flash = {
      message: message,
      type: 'success',
      keepAfterLocationChange: keepAfterLocationChange
    };
  }

  function showCustomMessage(type, isClear) {
    $rootScope.messages = {
      type: type,
      isClear: isClear
    };
    $cookieStore.put('noSesMes', $rootScope.messages);
  }

  function showError(message, keepAfterLocationChange) {
    $rootScope.globals.flash = {
      message: message,
      type: 'error',
      keepAfterLocationChange: keepAfterLocationChange
    };
  }

  initService();

  service.showSuccess = showSuccess;
  service.showError = showError;
  service.showCustomMessage = showCustomMessage;
  return service;

}]);
