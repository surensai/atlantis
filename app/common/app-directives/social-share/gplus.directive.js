'use strict';
angular.module("app").directive('gplusShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    template: '<a href="javascript:;" class="fa fa-google-plus fa-sm gplus-color"></a>',
    link: function (scope, element) {
      element.bind('click', function () {
        $window.open("https://plus.google.com/share?url=" + scope.item.image_url + "&text=" + scope.item.description, "_blank");
        return false;
      });
    }
  };
}]);





