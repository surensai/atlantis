'use strict';

angular.module('app').factory('flashService', ['$rootScope','$timeout', function ($rootScope,$timeout) {

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

        function Success(message, keepAfterLocationChange) {
            $rootScope.globals.flash = {
                message: message,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.globals.flash = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        initService();

        service.Success = Success;
        service.Error = Error;
        return service;

}]);
