'use strict';

angular.module('app').factory('flashService', ['$rootScope','$cookieStore','toaster', function ($rootScope, $cookieStore,toaster) {

  var service = {};

  function initService() {
    $rootScope.$on('$locationChangeStart', function () {
      clearFlashMessage();
    });

    function clearFlashMessage() {
      var flash = $rootScope.globals.flash;
      if (flash) {
        if (!flash.keepAfterLocationChange) {
          delete $rootScope.globals.flash;
        } else {
          // only keep for a single location change
          flash.keepAfterLocationChange = false;
        }
      }
    }
  }

  function showSuccess(message, keepAfterLocationChange) {
    toaster.pop({type:'success', title:"Success", body:message, timeout: 3000});
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
    toaster.pop({type:'error', title:"Error", body:message, timeout: 5000});
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
