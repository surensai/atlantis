'use strict';

angular.module('app').factory('DashboardService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = "http://ec2-54-159-195-71.compute-1.amazonaws.com";
  var userID = $rootScope.globals.currentUser.id;
  var fd = new FormData();

  service.getAllApi = function () {
    return $http.get(base_url + '/newsfeeds/' + userID + '/listnewsfeeds');
  };

  service.getByCategory = function () {
    return $http.get(base_url + '/newsfeeds/' + userID + '/categorynewsfeeds');
  };

  return service;


}]);

