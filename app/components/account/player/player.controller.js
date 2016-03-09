'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$state', 'PlayerService', 'flashService', function ($timeout, $state, PlayerService, flashService) {

  var player = this;
  player.model = {};
  player.data = {};
  player.modalTitle = 'Warning!';
  player.modalBody = 'Are you sure do you want to delete player?';
  player.data.playersList = [];
  player.playerObj = {};
  player.data.deleteObj = {};
  player.show = true;
  player.reverse = false;
  player.displayChartIndex = 0;
  player.predicate = 'Sno';

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
      if (data) {
        var playerId = data[0].id;
        if ($state.params.id) {
          playerId = $state.params.id;
        }
        player.data.playersList = data;
        player.playerObj = PlayerService.getObjById(data, playerId);
        $state.go('account.players.details', {id: playerId});
      }
    };

    var handleError = function () {
      flashService.showError("Error in getting players", false);
    };

    player.loadPromise = PlayerService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  }

  player.deleteListener = function (obj) {
    player.data.deleteObj = obj;
  };

  player.deleteAction = function () {

    var handleSuccess = function () {
      PlayerService.removeItem(player.data.playersList, player.data.deleteObj);
      angular.element('#pop').modal('hide');
      flashService.showSuccess("Player deleted successfully!", false);
    };

    var handleError = function () {
      flashService.showError("Error in deleting", false);
    };

    PlayerService.deleteApi(player.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  };

  player.bigBadges = [
    {
      milestone: 'Milestone 01',
      percentage: '130%',
      type: 'badge-gold'
    }, {
      milestone: 'Milestone 02',
      percentage: '100%',
      type: 'badge-silver'
    }, {
      milestone: 'Milestone 03',
      percentage: '80%',
      type: 'badge-bronze'
    }, {
      milestone: 'Milestone 04',
      percentage: '120%',
      type: 'badge-silver'
    }, {
      milestone: 'Milestone 05',
      percentage: '115%',
      type: 'badge-silver'
    }, {
      milestone: 'Milestone 06',
      percentage: '90%',
      type: 'badge-bronze'
    }, {
      milestone: 'Milestone 07',
      percentage: '50%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 08',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 09',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 10',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 11',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 12',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 13',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 14',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 15',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 16',
      percentage: '0%',
      type: 'badge-inactive'
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
        var newWord = {};
        angular.forEach(data, function (word, key) {
          if(word){
            newWord.Sno = key + 1;
            newWord.Words = word.word;
            newWord.lastPlayed = word.endtime;
            if(word.activity){
              newWord.attempts = word.activity.length;
              newWord.lastAttempt = word.activity[word.activity.length - 1].answer;
            }
            player.wordsData.push(newWord);
            newWord = {};
          }
        });
      }
    };

    var handleError = function () {
      flashService.showError("Error in getting words", false);
    };

    player.loadPromise = PlayerService.getWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
