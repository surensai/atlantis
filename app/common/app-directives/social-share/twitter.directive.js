'use strict';
angular.module("app").directive('twitterShare', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    template: '<a class="fa fa-twitter fa-lg" href="http://twitter.com/share?url={{item.files}}&text={{item.title}}" target="_blank"></a>',
    link: function () {
    }
  };
}]);
