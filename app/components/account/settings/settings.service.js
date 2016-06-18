'use strict';

angular.module('app').factory('settingsService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;

  function getUserID() {
    return $rootScope.globals.currentUser.id;
  }

  service.getApi = function () {
    return $http.get(base_url + '/usersettings/' + getUserID() + '/fetchusersettings');
  };

  service.updateApi = function (data) {
    return $http.post(base_url + '/usersettings/' + getUserID() + '/setusersettings', data);
  };

  service.getMissingCharactersApi = function () {
    return $http.get(base_url + '/PlaySets/' + getUserID() + '/listmissings');
  };

  service.updateMissingCharactersApi = function (data) {
    return $http.post(base_url + '/PlaySets/' + getUserID() + '/createmissings', data);
  };

  return service;

}]);
