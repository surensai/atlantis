'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$state', 'PlayerService', 'messagesFactory', function ($timeout, $state, PlayerService, messagesFactory) {

  var player = this;
  player.model = {};
  player.data = {};
  player.data.playersList = [];
  player.splitBadgesData = [];
  player.playerObj = {};
  player.reverse = false;
  player.clicked = false;
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

  player.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };


  (function () {
    getPlayers();
    splitBadgesData();
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
            messagesFactory.getPlayersError(status);
          });
        $state.go('account.players.details', {id: playerId});
      }

    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.getPlayersError(status);
      }
    };

   PlayerService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  }

  player.bigBadgesData = function (index) {
    var currentIndex =  index * 4;
    return player.bigBadges.slice(currentIndex, currentIndex+4);
  };

  function splitBadgesData(){
    if(player.bigBadges.length){
      var reminderVal = player.bigBadges.length % 4;
      var repeater = 4 - reminderVal;
      for(var i = 0; i < repeater; i++ ){
        player.bigBadges.push({});
      }
      for(var ii = 0; ii < player.bigBadges.length / 4; ii++ ){
        player.splitBadgesData.push({});
      }
    }
  }

  player.drag = 'drag feedback';
  player.drop = 'drop feedback';
  player.wordsData = [];

  player.showGraph = function (index, colIndex) {
    player.clicked = true;
    player.showRow = index;
    player.showColumn = colIndex;
  };


  player.getWords = function (childId) {
    var handleSuccess = function (data) {
      if (data) {
        player.wordsData = data;
      }
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.getPlayerwordsError(status);
      }
    };

    PlayerService.getWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  };


}]);
