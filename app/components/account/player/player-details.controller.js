'use strict';

angular.module("app").controller('playerDetailsCtrl', ['$scope','$state', function ($scope, $state) {
    var playerDetails = this;
    playerDetails.model = {};
    playerDetails.model.id = $state.params.id;
}]);

