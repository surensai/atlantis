'use strict';
angular.module("app").directive('fbShare', ['$window', function ($window) {
  return {
    restrict: 'A',
    scope: {
      index: '=index',
      item: '=itemdata'
    },
    template: '<a class="fa fa-facebook fa-lg" style="color:#3665A1"></a>',
    link: function (scope, element) {
      if (!$window.FB) {
        $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
          FB.init({
            appId: '221526371536033',
            xfbml: true,
            version: 'v2.5'
          });
        });
      }
      element.bind('click', function () {
        $window.open("https://www.facebook.com/dialog/feed?app_id=221526371536033&link=https://developers.facebook.com/docs/reference/dialogs/&picture="+scope.item.image_url+"&name="+scope.item.title+"&caption="+scope.item.title+"&description="+scope.item.description);
      });
    }
  };
}]);
