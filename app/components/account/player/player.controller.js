'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$rootScope', '$state', 'PlayerService', 'messagesFactory', 'flashService', '$uibModal', '$translate', 'AuthenticationService', '_', 'utilsFactory', 'appService', 'PlayerGraphService', function ($timeout, $rootScope, $state, PlayerService, messagesFactory, flashService, $uibModal, $translate, authService, _, utilsFactory, appService, PlayerGraphService) {
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";

  var player = this;
  player.maxPlayersLimit = $rootScope.globals.currentUser.playerLimit;
  player.model = {};
  player.model.wordTypeUI = "All";
  player.chartData = {};
  player.highchartsNG = getChartObj();
  player.data = {};
  player.playerObj = {};
  player.highlights = {};
  player.data.playersList = [];
  player.splitBadgesData = [];
  player.miniBadges = [];
  player.wordsData = [];
  player.lettersWordsData = [];
  player.nonsenseWordsData = [];
  player.csvData = [];
  player.isNoPlayer = false;
  player.getAllplayers = false;
  player.reverse = false;
  player.clicked = false;
  player.viewby = 5;
  player.totalItems = player.wordsData.length;
  player.currentPage = 1;
  player.itemsPerPage = player.viewby;
  player.displayChartIndex = 0;
  player.predicate = 'Sno';
  player.drag = 'drag feedback';
  player.drop = 'drop feedback';
  player.gridCount = 4;
  player.chartTabType = "";
  player.sortType = {};

  var wordsCsvData = [],
    daysXAxisLegArr = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthsXAxisLegArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  player.playerTableSort = function (type, sourceArray) {
    if (typeof player.sortType.reverse === "undefined") {
      player.sortType.reverse = false;
    } else {
      player.sortType.reverse = (player.sortType.reverse) ? false : true;
    }
    player.sortType.column = type;
    sourceArray = appService.simpleSort(sourceArray, type, player.sortType.reverse);
  };

  (function () {
    getPlayers();
    flashService.showPreviousMessage();
  })();

  player.onWordTypeChanges = function () {
    wordsCsvData = [];
    switch (player.model.wordTypeUI) {
      case "All":
        getWords(player.playerObj.id);
        break;
      case "Real Words":
        getRealWords(player.playerObj.id);
        break;
      case "Nonsense Words":
        getNonsenseWords(player.playerObj.id);
        break;
      case "Letters":
        getLettersWords(player.playerObj.id);
        break;
    }
  };

  player.addPlayer = function () {
    if (player.data.playersList.length >= player.maxPlayersLimit) {
      $uibModal.open({
        templateUrl: 'common/app-directives/modal/custom-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.modalTitle = $translate.instant('common.error');
          $scope.modalBody = $translate.instant('player.messages.max_players');
          $scope.modalType = $translate.instant('common.error');
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
    var currentIndex = index * player.gridCount;
    return player.bigBadges.slice(currentIndex, currentIndex + player.gridCount);
  };

  player.onGetChartData = function (chartType) {
    if (player.chartTabType === chartType) {
      return false;
    }
    player.chartTabType = chartType;
    getChartDataAPI(player.bigbadgedetails.id, player.playerObj.id, chartType);
  };

  player.showGraph = function (index, colIndex) {
    if (index === player.showRow && colIndex === player.showColumn && player.clicked) {
      player.clicked = false;
      return false;
    }
    player.clicked = true;
    player.showRow = index;
    player.showColumn = colIndex;
    var count = 0;

    if (player.bigBadges.length > 0) {
      for (var j = 0; j < player.bigBadges.length; j++) {
        if (player.showRow === j) {
          for (var k = 0; k < player.bigBadges.length; k++) {
            if (player.showColumn === k) {
              if (player.bigBadges[count].percentage === 0) {
                player.bigBadges[count].colorCode = "#BABCBE";
              }
              player.bigbadgedetails = player.bigBadges[count];

              break;
            } else {
              count++;
            }
          }
          break;
        } else {
          count = count + player.gridCount;
        }
      }
    }
    player.chartTabType = "";
    player.onGetChartData('day');
  };

  /*Get Chart Data from API & render in UI*/
  function getChartDataAPI(badgeId, playerId, chartType) {
    //Get Chart Data API Call
    PlayerService.getChartDetaisService(badgeId, playerId, chartType)
      .success(function (data) {
        player.chartData = data;
        //Update the Chart Object to render on UI
        player.highchartsNG = getChartObj(data);
      })
      .error(function (err, status) {
        if (status === 401) {
          authService.generateNewToken(function () {
            getChartDataAPI(badgeId, playerId, chartType);
          });
        }
        else {
          flashService.showError($translate.instant("player.messages.error_chart_data"), false);
        }

      });
    // End of API call
  }

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
        player.data.playersList = data;
        PlayerService.getPlayerById(playerId)
          .success(function (data) {
            player.playerObj = data;
            player.getAllplayers = true;
          })
          .error(function (err, status) {
            if (status === 401) {
              authService.generateNewToken(function () {
                getPlayers();
              });
            }
            else {
              flashService.showError($translate.instant("player.messages.error_getting_players"), false);
            }

          });
        $state.go('account.players.details', {id: playerId});
      }
    };
    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getPlayers();
        });
      }
      else {
        messagesFactory.getPlayersError(status);
      }
    };

    PlayerService.getAllApi(userID)
      .success(handleSuccess)
      .error(handleError);

  }

  function getWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.wordsData = [];
        var allWordObj = {},
          lastAttempts = [];
        for (var allWordsInd = 0; allWordsInd < data.length; allWordsInd++) {
          allWordObj = data[allWordsInd];

          allWordObj.correctAttempts = _.filter(allWordObj.gameAttempts, function (item) {
            return item === "1";
          }).length;
          allWordObj.inCorrectAttempts = _.filter(allWordObj.gameAttempts, function (item) {
            return item === "0";
          }).length;

          if (allWordObj.gameAttempts.length > 5) {
            lastAttempts = angular.copy(allWordObj.gameAttempts);
            lastAttempts.slice(Math.max(allWordObj.gameAttempts.length - 5, 1))
          } else {
            lastAttempts = angular.copy(allWordObj.gameAttempts);
          }

          allWordObj.lastAttempts = lastAttempts;
          allWordObj.lastAttemptedOn = utilsFactory.epochLinuxDateToDate(allWordObj.endtime);
          player.wordsData.push(allWordObj);

          wordsCsvData.push({
            Words: allWordObj._id,
            Correct: allWordObj.correctAttempts,
            Incorrect: allWordObj.inCorrectAttempts,
            LastAttempts: allWordObj.lastAttempts.join(","),
            LastPlayed: utilsFactory.dateFormatterForCSV(allWordObj.lastAttemptedOn)
          });
        }
        player.wordsData = appService.simpleSort(player.wordsData, 'endtime', true);
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getWords(childId);
        });
      }
      else {
        messagesFactory.getPlayerwordsError(status);
      }
    };

    PlayerService.getWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  }

  function getRealWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.realWordsData = [];
        var realWordObj = {},
          lastAttempts = [];

        for (var realWordIndex = 0; realWordIndex < data.length; realWordIndex++) {
          realWordObj = data[realWordIndex];
          realWordObj.correctAttempts = _.filter(realWordObj.gameAttempts, function (item) {
            return item === "1";
          }).length;
          realWordObj.inCorrectAttempts = _.filter(realWordObj.gameAttempts, function (item) {
            return item === "0";
          }).length;

          if (realWordObj.gameAttempts.length > 5) {
            lastAttempts = angular.copy(realWordObj.gameAttempts);
            lastAttempts.slice(Math.max(realWordObj.gameAttempts.length - 5, 1))
          } else {
            lastAttempts = angular.copy(realWordObj.gameAttempts);
          }

          realWordObj.lastAttempts = lastAttempts;
          realWordObj.lastAttemptedOn = utilsFactory.epochLinuxDateToDate(realWordObj.endtime);
          player.realWordsData.push(realWordObj);

          wordsCsvData.push({
            Words: realWordObj._id,
            Correct: realWordObj.correctAttempts,
            Incorrect: realWordObj.inCorrectAttempts,
            LastAttempts: realWordObj.lastAttempts.join(","),
            LastPlayed: utilsFactory.dateFormatterForCSV(realWordObj.lastAttemptedOn)
          });
        }
        player.realWordsData = appService.simpleSort(player.realWordsData, 'endtime', true);
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getRealWords(childId);
        });
      }
      else {
        messagesFactory.getPlayerwordsError(status);
      }
    };

    PlayerService.getRealWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  }

  function getNonsenseWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.nonsenseWordsData = [];
        var nonsenseWordObj = {};

        for (var nonsenceWordIndex = 0; nonsenceWordIndex < data.length; nonsenceWordIndex++) {
          nonsenseWordObj = data[nonsenceWordIndex];
          nonsenseWordObj.lastAttemptedOn = utilsFactory.epochLinuxDateToDate(nonsenseWordObj.endtime);
          player.nonsenseWordsData.push(nonsenseWordObj);
          wordsCsvData.push({
            NonsenseWords: nonsenseWordObj._id,
            Times: nonsenseWordObj.count,
            LastPlayed: utilsFactory.dateFormatterForCSV(nonsenseWordObj.lastAttemptedOn)
          });
        }
        player.nonsenseWordsData = appService.simpleSort(player.nonsenseWordsData, 'endtime', true);
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getNonsenseWords(childId);
        });
      }
      else {
        messagesFactory.getPlayerwordsError(status);
      }
    };

    PlayerService.getNonsenseWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  }

  function getLettersWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.lettersWordsData = [];
        var lettersObj = {};
        for (var lettersIndex = 0; lettersIndex < data.length; lettersIndex++) {
          lettersObj = data[lettersIndex];
          lettersObj.lastAttemptedOn = utilsFactory.epochLinuxDateToDate(lettersObj.value.LatestRepeatedTime);
          lettersObj.repeatedTimes = lettersObj.value.repeatedTimes;
          lettersObj.latestRepeatedTime = lettersObj.value.LatestRepeatedTime;
          player.lettersWordsData.push(lettersObj);
          wordsCsvData.push({
            LettersWords: lettersObj._id,
            Inputs: lettersObj.value.repeatedTimes,
            LastPlayed: utilsFactory.dateFormatterForCSV(lettersObj.lastAttemptedOn)
          });
        }
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getLettersWords(childId);
        });
      }
      else {
        messagesFactory.getPlayerwordsError(status);
      }
    };

    PlayerService.getLettersWordsApi(childId)
      .success(handleSuccess)
      .error(handleError);
  }

  function getMinibadges(playerId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.miniBadges = data;
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        AuthenticationService.generateNewToken(function () {
          getMinibadges(playerId);
        });
      } else {
        messagesFactory.getminibadgessError(status);
      }
    };

    PlayerService.getMinibadgesApi(playerId)
      .success(handleSuccess)
      .error(handleError);
  }

  function getBigBadges(playerId) {
    PlayerService.getBadges(playerId)
      .success(function (data) {
        player.bigBadges = sortWordsData(data);
        splitBadgesData();
      })
      .error(function (err, status) {
        if (status === 401) {
          AuthenticationService.generateNewToken(function () {
            getBigBadges(playerId);
          });
        } else {
          flashService.showError($translate.instant("player.messages.error_getting_players"), false);
        }
      });
  }

  function getPlayerHighlights(playerId) {
    var handleSuccess = function (data) {
      player.highlights = parsePlayerHighlitsData(data);
    };

    var handleError = function (error, status) {
      if (status === 401) {
        AuthenticationService.generateNewToken(function () {
          getPlayerHighlights(playerId);
        });
      } else {
        messagesFactory.getminibadgessError(status);
      }
    };

    PlayerService.getPlayerHighlightsApi(playerId)
      .success(handleSuccess)
      .error(handleError);
  }

  //Parse Player Data
  function parsePlayerHighlitsData(data) {
    var playerHighlightObj = data;
    var seconds = (playerHighlightObj.totalPlayedTime / 1000), minutes, hours;
    minutes = parseInt(seconds / 60, 10);
    hours = parseInt(minutes / 60, 10);
    minutes = minutes % 60;
    if (minutes || hours) {
      playerHighlightObj.timePlayedInMin = hours + ":" + minutes;
    } else {
      playerHighlightObj.timePlayedInMin = "0";
    }
    return playerHighlightObj;
  }

  function splitBadgesData() {
    if (player.bigBadges.length > 0) {
      var reminderVal = player.bigBadges.length % player.gridCount;
      var repeater = player.gridCount - reminderVal;
      for (var i = 0; i < repeater; i++) {
        player.bigBadges.push({});
      }

      for (var ii = 0; ii < player.bigBadges.length / player.gridCount; ii++) {
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

  function getChartObj(data) {
    var chartObj = PlayerGraphService.getChartObj(parseChartData(data), getXAxisLblRotation());
    return chartObj;
  }

  //Parse Chart Data
  function parseChartData(data) {
    var tempChartObj = {
      xAxisCatgryArr: [],
      seriesDataArr: []
    }, xAxisArr = [], yAxisArr = [], apiData;
    if (data && data.length) {
      switch (player.chartTabType) {
        case "day" || "":
          //This Week Data
          for (var chartCounter = 1; chartCounter <= 7; chartCounter++) {
            //API data
            apiData = parseXYAxisLegends(data, chartCounter);
            if (apiData.hasOwnProperty('xAxisVal') && apiData.hasOwnProperty('yAxisVal')) {
              xAxisArr.push(apiData.xAxisVal);
              yAxisArr.push(apiData.yAxisVal);
            } else {
              //Dummy Data
              xAxisArr.push(daysXAxisLegArr[chartCounter]);
              yAxisArr.push(0);
            }
          }
          break;
        case "week":
          //30 Days Data
          var tempWeekArr = [], weekArr = [];
          for (var weekCounter = 0; weekCounter < data.length; weekCounter++) {
            var weekObj = data[weekCounter]["_id"];
            weekObj.xAxisVal = Number(weekObj.weekOfMonth) + 1;
            weekObj.yAxisVal = data[weekCounter].count;
            tempWeekArr.push(weekObj);
          }
          tempWeekArr.sort(function (a, b) {
            return a.xAxisVal == b.xAxisVal ? 0 : a.xAxisVal < b.xAxisVal ? -1 : 1;
          });
          for (var sortedweekCntr = 1; sortedweekCntr <= 4; sortedweekCntr++) {
            var isWeekAPIDt = false;
            for (var weekAPICntr = 0; weekAPICntr < tempWeekArr.length; weekAPICntr++) {
              if (sortedweekCntr === tempWeekArr[weekAPICntr].xAxisVal) {
                isWeekAPIDt = true;
                xAxisArr.push("Week" + tempWeekArr[weekAPICntr].xAxisVal);
                yAxisArr.push(tempWeekArr[weekAPICntr].yAxisVal);
                break;
              }
            }
            if (!isWeekAPIDt) {
              xAxisArr.push("Week" + sortedweekCntr);
              yAxisArr.push(0);
            }
          }
          break;
        case "month":
          //1 Year Data
          for (var monthCounter = 1; monthCounter <= 12; monthCounter++) {
            //API data
            apiData = parseXYAxisLegends(data, monthCounter);
            if (apiData.hasOwnProperty('xAxisVal') && apiData.hasOwnProperty('yAxisVal')) {
              xAxisArr.push(apiData.xAxisVal);
              yAxisArr.push(apiData.yAxisVal);
            } else {
              //Dummy Data
              xAxisArr.push(monthsXAxisLegArr[monthCounter]);
              yAxisArr.push(0);
            }
          }
          break;
        case "year":
          //All Time Data
          var yearArr = [];
          for (var yearCounter = 0; yearCounter < data.length; yearCounter++) {
            var yearObj = data[yearCounter]["_id"];
            yearObj.xAxisVal = yearObj.year;
            yearObj.yAxisVal = data[yearCounter].count;
            yearArr.push(yearObj);
          }
          yearArr.sort(function (a, b) {
            return a.xAxisVal == b.xAxisVal ? 0 : a.xAxisVal < b.xAxisVal ? -1 : 1;
          });
          for (var sortedCntr = 0; sortedCntr < yearArr.length; sortedCntr++) {
            xAxisArr.push(yearArr[sortedCntr].xAxisVal);
            yAxisArr.push(yearArr[sortedCntr].yAxisVal);
          }
          break;
        default:
          break;
      }
      tempChartObj.xAxisCatgryArr = xAxisArr;
      tempChartObj.seriesDataArr = yAxisArr;
    }
    //Clear series data if Chart percentage is zero
    if (player.bigbadgedetails && player.bigbadgedetails.percentage === 0) {
      tempChartObj.seriesDataArr = [];
    }
    return tempChartObj;
  }

  //Parse X Axis Legends labels (e.g Days - Monday OR Months - Jan)
  function parseXYAxisLegends(data, chartCounter) {
    var chartDataObj = {};
    for (var dataCounter = 0; dataCounter < data.length; dataCounter++) {
      var obj = data[dataCounter]['_id'];
      //Days
      if ((player.chartTabType === "day" || player.chartTabType === "") && chartCounter === obj.dayOfWeek) {
        chartDataObj.xAxisVal = daysXAxisLegArr[obj.dayOfWeek];
        chartDataObj.yAxisVal = data[dataCounter].count;
        break;
      } else if (player.chartTabType === "month" && chartCounter === obj.month) {
        //Months
        chartDataObj.xAxisVal = monthsXAxisLegArr[obj.month];
        chartDataObj.yAxisVal = data[dataCounter].count;
        break;
      }
    }
    return chartDataObj;
  }

  //Resposive View X-Axis Label Rotation
  function getXAxisLblRotation() {
    //Mobile or responsive view
    if (document.documentElement.clientWidth < 700) {
      return -45;
    } else {
      //Desktop View
      return 0;
    }
  }

  player.getCSVHeader = function () {
    var wordsHeaders = [];
    switch (player.model.wordTypeUI) {
      case "Word":
      case "Real Words":
        wordsHeaders[0] = $translate.instant("player.real_word_headers.real_words");
        wordsHeaders[1] = $translate.instant("player.real_word_headers.correct");
        wordsHeaders[2] = $translate.instant("player.real_word_headers.incorrect");
        wordsHeaders[3] = $translate.instant("player.real_word_headers.last_played");
        wordsHeaders[4] = $translate.instant("player.real_word_headers.last_attempt");
        break;
      case "Nonsense Words":
        wordsHeaders[0] = $translate.instant("player.nonsense_headers.nonsense_words");
        wordsHeaders[1] = $translate.instant("player.nonsense_headers.times");
        wordsHeaders[2] = $translate.instant("player.nonsense_headers.last_played");
        break;
      case "Letters":
        wordsHeaders[0] = $translate.instant("player.letter_headers.letters");
        wordsHeaders[1] = $translate.instant("player.letter_headers.inputs");
        wordsHeaders[2] = $translate.instant("player.letter_headers.last_played");
        break;
    }
    return wordsHeaders;
  };

  player.getWordsExportData = function () {
    return wordsCsvData;
  };

  player.getWordsClickHandler = function () {
    getWords(player.playerObj.id);
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
