'use strict';
angular.module("app").directive('twitterShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    template: '<a class="fa fa-twitter fa-lg" style="color:#28AAE2"></a>',
    link: function (scope, element) {
      element.bind('click', function () {
        $window.open("https://twitter.com/share?url=" + scope.item.files + "&text=" + scope.item.title, "", "width=500,height=260,left=200,top=150,menubar=0");
        return false;
      });
    }
  };
}]);
