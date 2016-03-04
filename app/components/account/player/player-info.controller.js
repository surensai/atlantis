'use strict';

angular.module("app").controller('playerInfoCtrl', ['$scope', '$state', '$stateParams', 'PlayerService', function ($scope, $state, $stateParams, PlayerService) {
  var playerInfo = this;
  playerInfo.model = {};
  playerInfo.model.id = $stateParams.id;
  playerInfo.playerObj = PlayerService.getPlayerById($stateParams.id);
}]);

