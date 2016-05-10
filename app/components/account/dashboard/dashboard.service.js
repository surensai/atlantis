'use strict';

angular.module('app').factory('DashboardService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;
  var userID = $rootScope.globals.currentUser.id;

  service.getAllApi = function () {
    return $http.get(base_url + '/newsfeeds/' + userID + '/listallnewsfeeds');
  };

  service.getByCategory = function () {
    return $http.get(base_url + '/newsfeeds/' + userID + '/categorynewsfeeds');
  };

  return service;

}]);
