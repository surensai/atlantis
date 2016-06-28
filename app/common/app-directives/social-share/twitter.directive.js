'use strict';
angular.module("app").directive('twitterShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    template: '<a href="javascript:;" class="twitter-color"><img src="assets/images/twitter.png"></a>',
    link: function (scope, element) {
      element.bind('click', function () {
        $window.open("https://twitter.com/share?url=" + scope.item.image_url + "&text=" + scope.item.title, '_blank');
        return false;
      });
    }
  };
}]);
