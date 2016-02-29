'use strict';

angular.module('app').factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', 'UserService', '$remember', '$base64','$localStorage', function ($http, $cookieStore, $rootScope, UserService, $remember, $base64, $localStorage) {

  var service = {};
  var base_url = "http://ec2-52-71-125-138.compute-1.amazonaws.com";


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

    var currentUser = getUserFromToken();

  service.loginApi = function (data) {
    return $http.post(base_url + '/user/login', data);
  };

  service.SetCredentials = function (user, formData) {
    if (formData) {
      $localStorage.token =  user.tokenId;
     // user.authdata = $base64.encode(formData.email + ':' + formData.password);
     // $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;
    }
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
      $remember('7ZXYZ@L', $base64.encode(data.email));
      $remember('UU@#90', $base64.encode(data.password));
    } else {
      $remember('7ZXYZ@L', '');
      $remember('UU@#90', '');
    }
  };

  service.getRememberMe = function () {
    var data = {};
    if ($remember('7ZXYZ@L') && $remember('UU@#90')) {
      data.remember = true;
      data.email = $base64.decode($remember('7ZXYZ@L') + "==");
      data.password = $base64.decode($remember('UU@#90') + "=");
    }
    return data;
  };

  return service;

}]);
