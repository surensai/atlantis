'use strict';
var app = angular.module('app').config(['$windowProvider', '$translateProvider', function ($windowProvider, $translateProvider) {

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

}]);
