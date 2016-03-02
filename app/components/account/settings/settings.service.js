'use strict';

angular.module('app').factory('settingsService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;
  var userID = $rootScope.globals.currentUser.id;

  service.getApi = function () {
    return $http.get(base_url + '/usersettings/' + userID + '/fetchusersettings');
  };

  service.updateApi = function (data) {
    return $http.post(base_url + '/usersettings/' + userID + '/setusersettings', data);
  };

  return service;

}]);
