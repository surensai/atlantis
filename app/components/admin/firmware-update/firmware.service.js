'use strict';

angular.module('app').factory('firmwareService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;
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
