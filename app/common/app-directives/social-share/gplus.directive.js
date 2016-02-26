'use strict';
angular.module("app").directive('gplusShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    template: '<a class="fa fa-google-plus fa-lg"></a>',
    link: function (scope, element) {
      element.bind('click', function () {
        $window.open("https://plus.google.com/share?url=" + scope.item.files + "&text=" + scope.item.description, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
        return false;
      });
    }
  };
}]);




