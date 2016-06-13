'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$rootScope', '$state', 'PlayerService', 'messagesFactory', 'flashService', '$uibModal', '$translate', 'AuthenticationService', '_', function ($timeout, $rootScope, $state, PlayerService, messagesFactory, flashService, $uibModal, $translate, authService, _) {
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
  player.realWordsData = [];
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

  player.wordsHeaders = {
    Words: $translate.instant("player.word_headers.words"),
    Attempts: $translate.instant("player.word_headers.attempts"),
    LastPlayed: $translate.instant("player.word_headers.last_played"),
    LastAttempt: $translate.instant("player.word_headers.last_attempt")
  };

  player.lettersHeaders = {
    LettersWords: $translate.instant("player.letter_headers.letters"),
    Inputs: $translate.instant("player.letter_headers.inputs"),
    LastPlayed: $translate.instant("player.letter_headers.last_played")
  };

  player.nonsenseHeaders = {
    NonsenseWords: $translate.instant("player.nonsense_headers.nonsense_words"),
    Times: $translate.instant("player.nonsense_headers.times"),
    LastPlayed: $translate.instant("player.nonsense_headers.last_played")
  };

  player.realWordsHeaders = {
    Real_Words: $translate.instant("player.real_word_headers.real_words"),
    Correct: $translate.instant("player.real_word_headers.correct"),
    Incorrect: $translate.instant("player.real_word_headers.incorrect"),
    LastAttempt: $translate.instant("player.real_word_headers.last_attempt"),
    LastPlayed: $translate.instant("player.real_word_headers.last_played")
  };

  var wordsCsv = [],
    lettersWordsCsv = [],
    nonsenseWordsCsv = [],
    realWordsCsv = [],
    daysXAxisLegArr = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthsXAxisLegArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  player.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };

  (function () {
    getPlayers();
    flashService.showPreviousMessage();
  })();

  player.onWordTypeChanges = function () {
    switch (player.model.wordTypeUI) {
      case "Word":
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

  //Words
  function getWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.wordsData = data;
        var wordDate, formatedwordDate, utcSeconds, d;
        for (var i = 0; i < player.wordsData.length; i++) {
          wordDate = new Date(player.wordsData[i].endtime*1000);
          formatedwordDate = (wordDate.getMonth() + 1) + '/' + wordDate.getDate() + '/' + wordDate.getFullYear();

          utcSeconds = player.wordsData[i].endtime;
          // The 0 there is the key, which sets the date to the epoch
          d = new Date(0);
          d.setUTCSeconds(utcSeconds);

          var obj = {};
          obj.Words = player.wordsData[i].word;
          player.wordsData[i].endtime = d;
          obj.Attempts = player.wordsData[i].activity.length;
          obj.LastPlayed = player.wordsData[i].endtime;
          wordsCsv.push({
            Words: obj.Words,
            Attempts: obj.Attempts,
            LastPlayed: formatedwordDate
          });
        }
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

  //Letters Words
  function getLettersWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.lettersWordsData = data;
        var wordDate, formatedwordDate, utcSeconds, d;
        for (var i = 0; i < player.lettersWordsData.length; i++) {
          wordDate = new Date(player.lettersWordsData[i].value.LatestRepeatedTime*1000);
          formatedwordDate = (wordDate.getMonth() + 1) + '/' + wordDate.getDate() + '/' + wordDate.getFullYear();
          utcSeconds = player.lettersWordsData[i].value.LatestRepeatedTime;
          // The 0 there is the key, which sets the date to the epoch
          d = new Date(0);
          d.setUTCSeconds(utcSeconds);


          lettersWordsCsv.push({
            LettersWords: player.lettersWordsData[i]._id,
            Inputs: player.lettersWordsData[i].value.repeatedTimes,
            LastPlayed: player.lettersWordsData[i].value.LatestRepeatedTime
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

  //Nonsense Words
  function getNonsenseWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.nonsenseWordsData = data;

        var wordDate, formatedwordDate, utcSeconds, d;
        for (var i = 0; i < player.nonsenseWordsData.length; i++) {
          wordDate = new Date(player.nonsenseWordsData[i].endtime*1000);
          formatedwordDate = (wordDate.getMonth() + 1) + '/' + wordDate.getDate() + '/' + wordDate.getFullYear();

          utcSeconds = player.nonsenseWordsData[i].endtime;
          // The 0 there is the key, which sets the date to the epoch
          d = new Date(0);
          d.setUTCSeconds(utcSeconds);

          var obj = {};
          obj.Words = player.nonsenseWordsData[i]._id;
          obj.LastPlayed = player.nonsenseWordsData[i].endtime;
          player.nonsenseWordsData[i].endtime = d;
          //player.nonsenseWordsData[i].activity = JSON.parse(player.nonsenseWordsData[i].activity[0]);
          obj.Attempts = player.nonsenseWordsData[i].activity.length;
          nonsenseWordsCsv.push({
            NonsenseWords: obj.Words,
            Times: obj.Attempts,
            LastPlayed: formatedwordDate
          });
        }
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

  //Real Words
  function getRealWords(childId) {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        player.realWordsData = data;
        var wordDate, formatedwordDate, utcSeconds, d;

        for (var i = 0; i < player.realWordsData.length; i++) {
          wordDate = new Date(player.realWordsData[i].endtime*1000);
          formatedwordDate = (wordDate.getMonth() + 1) + '/' + wordDate.getDate() + '/' + wordDate.getFullYear();

          utcSeconds = player.realWordsData[i].endtime;
          // The 0 there is the key, which sets the date to the epoch
          d = new Date(0);
          d.setUTCSeconds(utcSeconds);

          var obj = {};
          obj.Words = player.realWordsData[i]._id;
          obj.LastPlayed = player.realWordsData[i].endtime;
          player.realWordsData[i].endtime = d;
          //player.realWordsData[i].activity = JSON.parse(player.realWordsData[i].activity[0]);
          obj.Attempts = player.realWordsData[i].activity.length;
          obj.correctCount = 0;
          obj.inCorrectCount = 0;
          obj.gameAttempts = player.realWordsData[i].gameAttempts;
          if (!obj.gameAttempts || obj.gameAttempts.length === 0) {
            obj.gameAttempts = [];
          }
          for (var corrtIncrtCounter = 0; corrtIncrtCounter < obj.gameAttempts.length; corrtIncrtCounter++) {
            if (obj.gameAttempts[corrtIncrtCounter] === 1) {
              obj.correctCount++;
            } else if (obj.gameAttempts[corrtIncrtCounter] === 0) {
              obj.inCorrectCount++;
            }
          }
          obj.gameAttempts.reverse();
          //update the UI also
          player.realWordsData[i].gameAttempts = obj.gameAttempts;
          player.realWordsData[i].correctCount = obj.correctCount;
          player.realWordsData[i].inCorrectCount = obj.inCorrectCount;
          realWordsCsv.push({
            Words: obj.Words,
            Correct: obj.correctCount,
            Incorrect: obj.inCorrectCount,
            LastPlayed: formatedwordDate,
            LastAttempts: obj.gameAttempts.join(",")
          });
        }
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
    PlayerService.getBadges(userID, playerId)
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
    playerHighlightObj.timePlayedInMin = hours + ":" + minutes;
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
    var formatedChartData = parseChartData(data);
    var chartObj = {
      exporting: {
        enabled: false
      },
      options: {
        exporting: {
          enabled: false
        },
        title: {
          text: ''
        },
        legend: {
          enabled: false
        },
        tooltip: {
          valueSuffix: '%'
        },
        chart: {
          type: 'line',
          backgroundColor: 'rgba(255, 255, 255, 0)'
        }
      },
      xAxis: {
        type: 'category',
        categories: formatedChartData.xAxisCatgryArr,
        title: {
          text: getXAxisLabel(),
          margin: 10
        },
        labels: {
          rotation: getXAxisLblRotation()
        }
      },
      yAxis: {
        min: 0,
        tickInterval: 5,
        title: {
          text: '<b>PROGRESS</b>'
        },
        labels: {
          format: "{value}" + "%"
        }
      },
      series: [{
        name: "Progress",
        color: '#4CBC96',
        marker: {
          symbol: 'circle'
        },
        data: formatedChartData.seriesDataArr
      }],
      size: {
        height: getChartHeight()
      },

      loading: false
    };
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

  function getXAxisLabel() {
    var xAxisLabel = "";
    if (player.chartTabType) {
      xAxisLabel = '<b>' + player.chartTabType.toUpperCase() + 'S</b>';
    }
    return xAxisLabel;
  }

  function getChartHeight() {
    var chartheight = 300;
    if (document.documentElement.clientWidth < 700) {
      chartheight = document.documentElement.clientWidth - 50;
    }
    return chartheight;
  }

  player.getCSVHeader = function (wordType) {
    var arr = [];
    switch(wordType) {
      case "word":
        arr[0] = $translate.instant("player.word_headers.words");
        arr[1] = $translate.instant("player.word_headers.attempts");
        arr[2] = $translate.instant("player.word_headers.last_played");
        break;
      case "letterword":
        arr[0] = $translate.instant("player.letter_headers.letters");
        arr[1] = $translate.instant("player.letter_headers.inputs");
        arr[2] = $translate.instant("player.letter_headers.last_played");
        break;
      case "nonsenseword":
        arr[0] = $translate.instant("player.nonsense_headers.nonsense_words");
        arr[1] = $translate.instant("player.nonsense_headers.times");
        arr[2] = $translate.instant("player.nonsense_headers.last_played");
        break;
      case "realword":
        arr[0] = $translate.instant("player.real_word_headers.real_words");
        arr[1] = $translate.instant("player.real_word_headers.correct");
        arr[2] = $translate.instant("player.real_word_headers.incorrect");
        arr[3] = $translate.instant("player.real_word_headers.last_played");
        arr[4] = $translate.instant("player.real_word_headers.last_attempt");
        break;
    }
    return arr;
  };

  player.getWordsExportData = function (wordType) {

    switch(wordType) {
      case "word":
        return wordsCsv;
        break;
      case "letterword":
        return lettersWordsCsv;
        break;
      case "nonsenseword":
        return nonsenseWordsCsv;
        break;
      case "realword":
        return realWordsCsv;
        break;
    }

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
