'use strict';

angular.module("app").controller('playerInfoCtrl', ['$scope','$state','$stateParams', function ($scope, $state,$stateParams) {
    var playerInfo = this;
    playerInfo.model = {};
    playerInfo.model.id = $stateParams.id;
}]);

