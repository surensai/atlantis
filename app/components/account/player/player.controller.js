'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$rootScope', '$state', 'PlayerService', 'messagesFactory','flashService','$uibModal', '$translate',function ($timeout, $rootScope, $state, PlayerService, messagesFactory,flashService, $uibModal, $translate) {
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
  player.csvData = [];
  player.isNoPlayer = false;
  player.reverse = false;
  player.clicked = false;
  player.viewby = 5;
  player.totalItems = player.wordsData.length;
  player.currentPage = 1;
  player.itemsPerPage = player.viewby;
  player.displayChartIndex = 0;
  player.predicate = 'Sno';
  player.wordsHeaders = {
    Words: $translate.instant("player.word_headers.words"),
    Attempts:  $translate.instant("player.word_headers.attempts"),
    LastPlayed: $translate.instant("player.word_headers.last_played"),
    LastAttempt:$translate.instant("player.word_headers.last_attempt")
  };
  player.drag = 'drag feedback';
  player.drop = 'drop feedback';
  player.gridCount = 4;
  var wordsCsv = [];
  player.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };


  (function () {
    getPlayers();
  })();

  player.addPlayer = function(){
    if (player.data.playersList.length >= 5) {
     $uibModal.open({
        templateUrl: 'common/app-directives/modal/custom-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.modalTitle = $translate.instant('player.add_modaltitle');
          $scope.modalBody = $translate.instant('player.add_modalbody');
          $scope.modalType = $translate.instant('player.add_modaltype');
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
    var currentIndex =  index * player.gridCount;
    return player.bigBadges.slice(currentIndex, currentIndex+player.gridCount);
  };

  player.showGraph = function (index, colIndex) {
    player.clicked = true;
    player.showRow = index;
    player.showColumn = colIndex;
    var count = 0;
    for(var j=0;j<player.bigBadges.length;j++){
      if(player.showRow === j){
        for(var k=0;k<player.bigBadges.length;k++){
          if(player.showColumn === k){
            player.bigbadgedetails  = player.bigBadges[count];
            break;
          }else{
            count++;
          }
        }
        break;
      }else {
        count=count+player.gridCount;
      }
    }
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
        getBigBadges(playerId);
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
        for(var i=0;i<player.wordsData.length;i++){
          var obj={};
          obj.Words = player.wordsData[i].word;
          obj.Attempts = player.wordsData[i].activity.length;
          obj.LastPlayed = player.wordsData[i].endtime;

          wordsCsv.push({
            Words: obj.Words,
            Attempts: obj.Attempts,
            LastPlayed:obj.LastPlayed
          });
        }
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


  function getBigBadges(playerId) {
    PlayerService.getBadges(userID,playerId)
      .success(function (data) {
        player.bigBadges = sortWordsData(data);
        splitBadgesData();
      })
      .error(function () {
        flashService.showError($translate.instant("player.messages.error_getting_players"), false);
      });
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
    if(player.bigBadges.length > 0){
      var reminderVal = player.bigBadges.length % player.gridCount;
      var repeater = player.gridCount - reminderVal;
      for(var i = 0; i < repeater; i++ ){
        player.bigBadges.push({});
      }

      for(var ii = 0; ii < player.bigBadges.length / player.gridCount; ii++ ){
        player.splitBadgesData.push({});
      }
    }
  }

  function sortWordsData(arr) {
    arr.sort(function (a, b) {
      return a.incrementflag - b.incrementflag;
    });

    return arr;
  }


  player.highchartsNG = {
    options: {
      chart: {
        type: 'line'
      }
    },
    xAxis: {
      categories: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7', 'Day8'],
      labels: {
        rotation: 0
      }
    },
    series: [{
      data: [2, 5, 8, 12, 15, 6, 5]
    }],
    title: {
      text: ''
    },
    loading: false,
    size:{height:300},
    exporting: { enabled: false }
  };

  player.getCSVHeader = function () {
    var arr = [];
    arr[0] = $translate.instant("player.word_headers.words");
    arr[1] =   $translate.instant("player.word_headers.last_played");
    arr[2] =   $translate.instant("player.word_headers.attempts");
    return arr;
  };
  player.getWordsExportData = function(){
    return arr;
  };
}]);

app.directive('resize', function ($window) {
  return function (scope) {
    var w = angular.element($window);
    scope.getWindowDimensions = function () {
      return {
        'h': w.height(),
        'w': w.width()
      };
    };
    scope.$watch(scope.getWindowDimensions, function (newValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;

      scope.style = function () {
        return {
          'height': (newValue.h - 100) + 'px',
          'width': (newValue.w - 100) + 'px'
        };
      };

    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  };
});
