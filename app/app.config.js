'use strict';
var app = angular.module('app').config(['$windowProvider', '$translateProvider','$httpProvider', function ($windowProvider, $translateProvider, $httpProvider) {

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

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
  }]);

}]);
