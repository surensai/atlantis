angular.module("app").directive('badgeItem', function () {
  return {
    restrict: 'E',
    scope: {
      index: '=index',
      item: '=itemData',
      displayIndex: '=displayIndex',
      callFunc: '&'
    },
    template: '<div class="col-md-3 col-sm-6">' +
              '<div class="badge-item" data-ng-class="item.type"> ' +
              '<span>{{item.milestone}}</span>' +
              '<h3>{{item.percentage}}</h3></div>' +
              '<div class="graph-container clearfix" data-ng-show="displayIndex === index "> {{displayIndex}} - test - {{index}} </div></div>' +
              '</div>',

    controller: function($scope) {

    }
  }
});
