'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$rootScope', '$state', 'PlayerService', 'messagesFactory','flashService','$uibModal', function ($timeout, $rootScope, $state, PlayerService, messagesFactory,flashService, $uibModal) {
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";
  var player = this;
  player.model = {};
  player.data = {};
  player.playerObj = {};
  player.highlights = {};
  player.data.playersList = [];
  player.splitBadgesData = [];
  player.miniBadges=[];
  player.wordsData = [];
  player.isNoPlayer = false;
  player.reverse = false;
  player.clicked = false;

  player.displayChartIndex = 0;
  player.predicate = 'Sno';
  player.wordsHeaders = {
    Words: "Words",
    Attempts: "Attempts",
    LastPlayed: "Last Played",
    LastAttempt: "Last Attempt"
  };
  player.drag = 'drag feedback';
  player.drop = 'drop feedback';

  player.bigBadges = PlayerService.getBadges();

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

  player.addPlayer = function(){
    if (player.data.playersList.length >= 5) {
     $uibModal.open({
        templateUrl: 'common/app-directives/modal/custom-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.modalTitle = "Error";
          $scope.modalBody = "You already have the maximum number of players added.";
          $scope.modalType = "Error";
          $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }]
      });
    } else {
      $state.go("account.addplayer");
    }
  };

  player.bigBadgesData = function (index) {
    var currentIndex =  index * 4;
    return player.bigBadges.slice(currentIndex, currentIndex+4);
  };

  player.showGraph = function (index, colIndex) {
    player.clicked = true;
    player.showRow = index;
    player.showColumn = colIndex;
  };

  function getPlayers() {
    var handleSuccess = function (data) {
      player.isNoPlayer = true;
      if (data.length > 0) {
        var playerId = data[0].id;
        if ($state.params.id) {
          playerId = $state.params.id;
        }
        getPlayerHighlights(playerId);
        getMinibadges(playerId);
        getWords(playerId);
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
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.getPlayersError(status);
      }
    };

    PlayerService.getAllApi(userID)
      .success(handleSuccess)
      .error(handleError);
  }

  function getWords(childId) {
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
  }

  function getMinibadges (playerId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].status === 'Active') {
            player.miniBadges.assetURL = data[i].assetURL;
          }else {
          player.miniBadges.assetURL = data[i].disabledassetURL;
        }
      }
        player.miniBadges = data;
      }
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.getminibadgessError(status);
      }
    };

    PlayerService.getMinibadgesApi(playerId)
      .success(handleSuccess)
      .error(handleError);
  }

  function getPlayerHighlights (playerId) {
    var handleSuccess = function (data) {
      player.highlights = data;
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.getminibadgessError(status);
      }
    };

    PlayerService.getPlayerHighlightsApi(playerId)
      .success(handleSuccess)
      .error(handleError);
  }

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

}]);
