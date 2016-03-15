'use strict';

angular.module('app').factory('UserService', ['$http', '$rootScope', function ($http, $rootScope) {

  var service = {};
  var base_url = $rootScope.base_url;

  function getUserID() {
    return $rootScope.globals.currentUser.id;
  }

  service.Create = function (user) {
    return $http.post(base_url + '/user/register', user);
  };
  service.Update = function (user) {
    return $http.put(base_url + '/user/' + getUserID() + '/edit-profile', user);
  };
  service.changePasswordAPI = function (user) {
    return $http.post(base_url + '/user/' + getUserID() + '/change-password', user);
  };
  service.forgotPasswordAPI = function (user) {
    return $http.post(base_url + '/user/forgot-password', user);
  };
  service.authorizeTokenAPI = function (baseUrl, tokenID) {
    return $http.get(baseUrl + '/user/verify/token/' + tokenID);
  };
  service.resetPasswordAPI = function (user, token) {
    return $http.post(base_url + '/user/reset-password?token=' + token, user);
  };
  service.confirmRegistrationAPI = function(tokenID){
    return $http.get(base_url + '/user/confirmation/'+ tokenID);
  };

  return service;

}]);
