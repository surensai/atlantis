'use strict';

angular.module('app').factory('DashboardService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;

  function getUserID() {
    return $rootScope.globals.currentUser.id;
  }

  service.getAllApi = function () {
    return $http.get(base_url + '/newsfeeds/' + getUserID() + '/listallnewsfeeds');
  };

  service.getByCategory = function () {
    return $http.get(base_url + '/newsfeeds/' + getUserID() + '/categorynewsfeeds');
  };

  return service;

}]);
