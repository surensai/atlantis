'use strict';
var app = angular.module('app').config(['$windowProvider', '$translateProvider', '$httpProvider', function ($windowProvider, $translateProvider, $httpProvider) {

  $translateProvider.useStaticFilesLoader({
    prefix: 'assets/i18n/',
    suffix: '.json'
  });

  var browserLanguage = $windowProvider.$get().navigator.language ? $windowProvider.$get().navigator.language : $windowProvider.$get().navigator.browserLanguage;
  if (browserLanguage === undefined) {
    browserLanguage = 'en';
  } else {
    browserLanguage = browserLanguage.toLowerCase();
  }

  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('escape');

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', '$rootScope', 'appService', function ($q, $location, $localStorage, $rootScope, appService) {
    $rootScope.ajaxProgress = 0;

    if (!String.prototype.contains) {
      String.prototype.contains = function (str) {
        return (this.indexOf(str) !== -1);
      };
    }
    return {
      'request': function (config) {
        var str = config.url;
        config.headers = config.headers || {};
        if ($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }

        $rootScope.ajaxProgress++;
        return config;
      },
      'response': function (response) {
        var str = response.config.url;
        $rootScope.ajaxProgress--;
        appService.isFooterFixed();
        return response;
      },
      'responseError': function (rejection) {
        var str = rejection.config.url;
        if (rejection.status === 401 || rejection.status === 403) {
          $location.path('/login');
        }
        appService.isFooterFixed();
        $rootScope.ajaxProgress--;
        return $q.reject(rejection);
      }
    };

  }]);

}]);
