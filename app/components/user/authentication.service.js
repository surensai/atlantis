'use strict';

angular.module('app').factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', 'UserService', '$remember', '$base64' ,function ($http, $cookieStore, $rootScope, UserService, $remember, $base64) {


    var service = {};
    var base_url = "http://ec2-54-159-195-71.compute-1.amazonaws.com";
    // Base64 encoding service used by AuthenticationService

    service.loginApi = function (data) {
        return $http.post(base_url + '/user/login', data);
    };

    service.SetCredentials = function (user, formData) {
        if(formData){
          user.authdata = $base64.encode(formData.email + ':' + formData.password);
          $http.defaults.headers.common['Authorization'] = 'Basic ' + user.authdata; // jshint ignore:line
        }
        $rootScope.globals = {
            currentUser: user
        };
        $cookieStore.put('globals', $rootScope.globals);
    };

    service.ClearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
    };

    service.setRememberMe = function (data) {
        if (data.remember) {
            $remember('7ZXYZ@L', data.email);
            $remember('UU@#90', data.password);
        } else {
            $remember('7ZXYZ@L', '');
            $remember('UU@#90', '');
        }
    };

    service.getRememberMe = function () {
        var data = {};
        if ($remember('7ZXYZ@L') && $remember('UU@#90') ) {
            data.remember = true;
            data.email = $remember('7ZXYZ@L');
            data.password = $remember('UU@#90');
        }
        return data;
    };

    return service;

}]);
