'use strict';
angular.module("app").directive('modal', function () {
    return {
        restrict: 'EA',
        scope: {
            title: '=modalTitle',
            header: '=modalHeader',
            body: '=modalBody',
            footer: '=modalFooter',
            callbackbuttonleft: '&ngClickLeftButton',
            callbackbuttonright: '&ngClickRightButton',
            handler: '=myHandler'
        },
        templateUrl: 'common/app-directives/modal/modal.view.html',
        transclude: true,
        controller: function ($scope) {
            $scope.handler = 'pop';
        }
    };
});
