app.directive('customPanel', function () {
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      heading: '@heading',
      themeClass: '@themeClass',
      headerIcon: '@headerIcon',
      totalCount: '@totalCount',
      totalText: '@totalText',
      activeCount: '@activeCount',
      activeText: '@activeText',
      totalPercentage:'@totalPercentage',
      outofService:'@outofService',
      total:'@total',
      closed:'@closed',
      open:'@open'
    },
    templateUrl: 'common/app-directives/custom-panel/custom-panel.view.html',
    controller: function ($scope) {
        $scope.refresh = function () {
         $scope.totalCount = parseInt(Math.random()*10)+5;
         $scope.activeCount = parseInt(Math.random()*10)+5;
         $scope.outofService = parseInt(Math.random()*10)+5;
         $scope.totalPercentage = parseInt(Math.random()*50)+5;
         $scope.total = parseInt(Math.random()*10)+5;
         $scope.open = parseInt(Math.random()*10)+5;
         $scope.closed = parseInt(Math.random()*10)+5;
    };
    }
    
  };
});