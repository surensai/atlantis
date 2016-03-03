'use strict';

angular.module("app").controller('playerDetailsCtrl', ['$scope','$state','$stateParams', function ($scope, $state,$stateParams) {
    var playerDetails = this;
    playerDetails.model = {};
    playerDetails.model.id = $stateParams.id;
}]);

