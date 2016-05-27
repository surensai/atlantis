'use strict';

angular.module('app').factory('StaticService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;

  service.getPrivacyAPI = function(){
    return $http.get(base_url + '/cms/listCmsbyCategory/privacy');
  };

  service.getTermsAPI = function(){
    return $http.get(base_url + '/cms/listCmsbyCategory/terms');
  };

    service.getwarrantyAPI = function(){
      return $http.get(base_url + '/cms/listCmsbyCategory/warranty');
    };

  return service;


}]);
