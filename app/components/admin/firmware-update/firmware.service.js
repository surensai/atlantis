'use strict';

angular.module('app').factory('firmwareService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = "http://ec2-52-71-125-138.compute-1.amazonaws.com";
  var userID = $rootScope.globals.currentUser.id;
  var fd = new FormData();

  service.createApi = function (child) {
    return $http.post(base_url + '/firmware/setotaupdates', child);
  };

  service.uploadFileApi = function (file) {
    fd.append('content', file);
    return $http.post(base_url + '/file/uploads3',fd,{
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    });
  };

  return service;

}]);
