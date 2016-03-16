angular.module("app").directive('badgeItem', function () {
  return {
    restrict: 'AE',
    scope: {
      index: '=index',
      item: '=itemData',
      displayIndex: '=displayIndex',
      callFunc: '&'
    },
    template: '<div class="badge-item center-align"> ' +
              '<img ng-src="assets/images/{{item.type}}.png" />'+
              '<span>{{item.milestone}}</span>' +
              '</div></div>',

    controller: function() {

    }
  };
});
