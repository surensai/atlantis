'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$state', 'PlayerService', 'flashService','$translate', function ($timeout, $state, PlayerService, flashService, $translate) {

  var player = this;
  player.model = {};
  player.data = {};
  player.data.playersList = [];
  player.playerObj = {};
  player.show = true;
  player.reverse = false;
  player.displayChartIndex = 0;
  player.predicate = 'Sno';
  player.isNoPlayer = false;
  player.wordsHeaders = {
    Sno: "S.No.",
    Words: "Words",
    Attempts: "Attempts",
    LastPlayed: "Last Played",
    LastAttempt: "Last Attempt"
  };

  player.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };

  player.closeAlert = function () {
    player.show = false;
  };

  (function () {
    getPlayers();
  })();

  function getPlayers() {
    var handleSuccess = function (data) {
      player.isNoPlayer = true;
      if (data.length > 0) {
        var playerId = data[0].id;
        if ($state.params.id) {
          playerId = $state.params.id;
        }
        player.data.playersList = data;
        PlayerService.getPlayerById(playerId)
          .success(function (data) {
            player.playerObj = data;
          })
          .error(function () {
            flashService.showError($translate.instant("player.messages.error_getting_players"), false);
          });
        $state.go('account.players.details', {id: playerId});
      }

    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_getting_players"), false);
    };

    player.loadPromise = PlayerService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  }

  player.bigBadges = [
    {
      milestone: 'Apple',
      percentage: '130%',
      type: '120-alphabet'
    }, {
      milestone: 'Up',
      percentage: '100%',
      type: '100-up'
    }, {
      milestone: 'Cat',
      percentage: '80%',
      type: '80-cat'
    }, {
      milestone: 'Sight',
      percentage: '120%',
      type: 'strted-sight'
    }, {
      milestone: 'Pancake',
      percentage: '115%',
      type: 'Pancake'
    }, {
      milestone: 'Fish',
      percentage: '90%',
      type: 'Fish'
    }, {
      milestone: 'Brick',
      percentage: '50%',
      type: 'Brick'
    }, {
      milestone: 'Floss',
      percentage: '0%',
      type: 'Floss'
    }, {
      milestone: 'Bee',
      percentage: '0%',
      type: 'Bee'
    }, {
      milestone: 'Sky',
      percentage: '0%',
      type: 'Sky'
    }, {
      milestone: 'Car',
      percentage: '0%',
      type: 'Car'
    }, {
      milestone: 'Light',
      percentage: '0%',
      type: 'Light'
    }, {
      milestone: 'Bear',
      percentage: '0%',
      type: 'Bear'
    }, {
      milestone: 'House',
      percentage: '0%',
      type: 'House'
    }, {
      milestone: 'Swan',
      percentage: '0%',
      type: 'Swan'
    }];

  player.drag = 'drag feedback';
  player.drop = 'drop feedback';
  player.wordsData = [];

  player.showGraph = function (index) {
    player.displayChartIndex = index;
  };

  player.getWords = function (childId) {
    var handleSuccess = function (data) {
      if (data) {
        player.wordsData = data;
      }
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_getting_words"), false);
    };

    PlayerService.getWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  };

}]);
