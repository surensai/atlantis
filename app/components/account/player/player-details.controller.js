'use strict';

angular.module("app").controller('playerDetailsCtrl', ['$timeout', '$state', 'PlayerService', 'flashService','$scope', function ($timeout, $state, PlayerService, flashService, $scope) {

    var playerDetails = this;
    playerDetails.modalTitle = 'Warning!';
    playerDetails.modalBody = 'Are you sure do you want to delete player?';
    playerDetails.isUpdate = false;
    playerDetails.model = {};
    playerDetails.data = {};

    (function () {

    })();
}]);

