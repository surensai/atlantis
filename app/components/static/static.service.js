'use strict';

angular.module('app').factory('StaticService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;

  service.getPrivacyAPI = function(user_id){
    return $http.get(base_url + '/cms/listCmsbyCategory/privacy');
  };

  service.getTermsAPI = function(word){
    return $http.get(base_url + '/cms/listCmsbyCategory/terms');
  };



  return service;


}]);
