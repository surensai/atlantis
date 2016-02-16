'use strict';
angular.module("app").directive('fbShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    link: function (scope, element) {
      if (!$window.FB) {
        $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
          FB.init({
            appId: '1143723928970998',
            xfbml: true,
            version: 'v2.5'
          });
        });
      }
      element.bind('click', function () {
        FB.ui({
          method: 'feed',
          link: 'http://google.com',
          caption: scope.item.title,
          picture: scope.item.files,
          name: scope.item.title,
          description: scope.item.description
        }, function () {

        });
      });
    }
  };
}]);
