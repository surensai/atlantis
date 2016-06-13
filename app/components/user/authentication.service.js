'use strict';

angular.module('app').factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', 'UserService', 'rememberFactory', '$localStorage','$state', function ($http, $cookieStore, $rootScope, UserService, rememberFactory, $localStorage, $state) {

  var service = {};
  var base_url = $rootScope.base_url;
  var currentUser;

  function changeUser(user) {
    angular.extend(currentUser, user);
  }

  function urlBase64Decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  function getUserFromToken() {
    var token = $localStorage.token;
    var user = {};
    if (typeof token !== 'undefined') {
      var encoded = token.split('.')[1];
      user = JSON.parse(urlBase64Decode(encoded));
    }
    return user;
  }

  currentUser = getUserFromToken();

  service.loginApi = function (data) {
    return $http.post(base_url + '/user/login', data);
  };

  service.SetCredentials = function (user, formData) {
    if (formData) {
      $localStorage.token = user.tokenId;
    }

    if($cookieStore.get('globals')){
      service.ClearCredentials();
    }

    delete user.player;
    $rootScope.globals = {
      currentUser: user
    };
    $cookieStore.put('globals', $rootScope.globals);
  };

  service.ClearCredentials = function () {
    $rootScope.globals = {};
    $cookieStore.remove('globals');
    changeUser({});
    delete $localStorage.token;
    $http.defaults.headers.common.Authorization = 'Bearer';
  };

  service.setRememberMe = function (data) {
    if (data.remember) {
      rememberFactory('7ZXYZ@L', btoa(data.email));
      rememberFactory('UU@#90', btoa(data.password));
    } else {
      rememberFactory('7ZXYZ@L', '');
      rememberFactory('UU@#90', '');
    }
  };

  service.getRememberMe = function () {
    var data = {};
    if (rememberFactory('7ZXYZ@L') && rememberFactory('UU@#90')) {
      data.remember = true;
      data.email = atob(rememberFactory('7ZXYZ@L'));
      data.password = atob(rememberFactory('UU@#90').toString());
    }
    return data;
  };

  service.generateNewToken = function (cb) {
    $http.post($rootScope.base_url + '/user/generate/new-token', {refreshToken: $localStorage.token}).success(function (data) {
      if (data.token) {
        $localStorage.token = data.token;
      }
      if (cb) {
        cb();
      }
    }).error(function () {
      $state.go("login");
    });
  };

  return service;

}]);
