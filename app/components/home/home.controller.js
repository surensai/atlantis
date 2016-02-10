'use strict';

app.controller('homeCtrl', ['$scope', function ($scope) {

	$scope.header = 'Put here your header';
    $scope.body = 'Put here your body';
    $scope.footer = 'Put here your footer';

    $scope.myRightButton = function (bool) {
        alert('!!! first function call!');
    };
   	
}]);