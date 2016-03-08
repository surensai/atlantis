angular.module("app").directive('badgeItem', function () {
  return {
    restrict: 'AE',
    scope: {
      index: '=index',
      item: '=itemData',
      displayIndex: '=displayIndex',
      callFunc: '&'
    },
    template: '<div class="badge-item" data-ng-class="item.type"> ' +
              '<span>{{item.milestone}}</span>' +
              '<h3>{{item.percentage}}</h3></div>' +
              '</div>',

    controller: function($scope) {

    }
  }
});
