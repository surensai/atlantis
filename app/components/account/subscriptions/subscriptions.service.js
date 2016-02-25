'use strict';

angular.module('app').factory('SubscriptionsService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = "http://ec2-52-71-125-138.compute-1.amazonaws.com";
  var userID = $rootScope.globals.currentUser.id;

  service.getApi = function () {
    return $http.get(base_url + '/usersettings/' + userID + '/fetchusersettings');
  };

  service.updateApi = function (data) {
    return $http.post(base_url + '/usersettings/' + userID + '/setusersettings', data);
  };

  return service;

}]);
