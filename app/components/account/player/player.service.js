'use strict';

angular.module('app').factory('PlayerService', ['$http', '$rootScope', "_", function ($http, $rootScope, _) {

  var service = {};
  var base_url = $rootScope.base_url;
  var playersData = [];

  function getUserID() {
    return $rootScope.globals.currentUser.id;
  }

  service.getAllApi = function () {
    return $http.get(base_url + '/user/' + getUserID() + '/child');
  };

  service.getWordsApi = function (playerId) {
    return $http.get(base_url + '/activity/' + getUserID() + '/' + playerId);
  };
  //Get Letters API
  service.getLettersWordsApi = function (playerId) {
    return $http.get(base_url + '/word/' + playerId + "/singleletterwords");
  };
//Get Nonsense Words API
  service.getNonsenseWordsApi = function (playerId) {
    return $http.get(base_url + '/word/' + playerId + "/nonsensewords");
  };
//Get Real Words API
  service.getRealWordsApi = function (playerId) {
    return $http.get(base_url + '/word/' + playerId + "/realwords");
  };
  service.getMinibadgesApi = function (playerId) {
    return $http.get(base_url + '/activity/' + getUserID() + '/' + playerId + '/minibadges');
  };

  service.getPlayerHighlightsApi = function (playerId) {
    return $http.get(base_url + '/activity/' + getUserID() + '/' + playerId + '/highlights');
  };

  service.searchWordApi = function (childId) {
    return $http.get(base_url + '/activity/' + getUserID() + '/' + childId);
  };

  service.createApi = function (child) {
    return $http.post(base_url + '/user/' + getUserID() + '/student', child);
  };

  service.deleteApi = function (id) {
    return $http.delete(base_url + '/user/' + getUserID() + '/student/' + id);
  };

  service.updateApi = function (childID, child) {
    return $http.put(base_url + '/user/' + getUserID() + '/student/' + childID + '/edit', child);
  };

  service.saveWordApi = function (wordData) {
    return $http.post(base_url + '/private/' + getUserID() + '/createword', wordData);
  };

  service.uploadFileApi = function (file) {
    var fd = new FormData();
    fd.append('content', file);
    return $http.post(base_url + '/file/uploads3', fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    });
  };

  service.getObjById = function (data, id) {
    var obj = {};
    _.each(data, function (item) {
      if (item.id === id) {
        obj = item;
      }
    });
    return obj;
  };

  service.setPlayers = function (data) {
    playersData = data;
  };

  service.getPlayers = function () {
    return playersData;
  };

  service.getPlayerById = function (id) {
    return $http.get(base_url + '/user/' + getUserID() + '/child/' + id);
  };

  service.removeItem = function (data, obj) {
    data.splice(data.indexOf(obj), 1);
  };

  service.getBadges = function (childID) {
    return $http.get(base_url + '/activity/' + getUserID() + '/' + childID + '/bigbadges');
  };

  service.getAvatarsAPI = function () {
    return $http.get(base_url + '/avatar/' + getUserID() + '/get-avatars');
  };

  function checkLetterDataAvailable(sourceData, letter) {
    var letterAvailable = false;
    for (var ind = 0; ind < sourceData.length; ind++) {
      if (sourceData[ind].letter.toLowerCase() === letter.toLowerCase()) {
        letterAvailable = true;
        break;
      }
    }
    return letterAvailable;
  }

  service.addLetterIfNotExist = function (sourceArr) {
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var resultArr = [];
    for (var ind = 0; ind < letters.length; ind++) {
      if (!checkLetterDataAvailable(sourceArr, letters[ind])) {
        var emptyObj = {
          letter: letters[ind],
          arrayLetters: [],
          count: 0,
          lastAttemptedOn: "1403366899"
        };
        resultArr.push(emptyObj);
      }
    }
    return resultArr.concat(sourceArr);
  };

  service.getChartDetaisService = function (badgeId, playerId, chartType) {
    return $http.get(base_url + '/biggraphs/' + badgeId + "/" + playerId + "/" + chartType);
  };

  function selectPeriod(period) {
    var obj = {};
    if (period === 'week') {
      obj.day = '%a';
    } else if (period === 'month') {
      obj.day = '%e %b';
    } else {
      obj.month = '%b %y';
    }
    return obj;
  }

  service.getChartDataObj = function (data, period, playerName) {
    return {
      options: {
        exporting: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        chart: {
          type: 'line',
          backgroundColor: 'rgba(255, 255, 255, 0)'
        },
        title: {
          text: ''
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: 'Progress : {point.y:.2f}',
          valueSuffix: '%'
        }
      },
      xAxis: {
        type: 'datetime',
        tickInterval: period === "year" ? 28 * 24 * 3600 * 1000 : 24 * 3600 * 1000,
        dateTimeLabelFormats: selectPeriod(period),
        max: period === "year" ? Date.UTC(new Date().getFullYear(), 11, 31, 23, 59, 59) : null,
        title: {
          text: '<b>' + playerName + " Progress </b>"
        }
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: '<b>Total Game Score</b>'
        },
        labels: {
          format: "{value}" + "%"
        }
      },
      series: [{
        name: playerName + " Progress",
        color: '#4CBC96',
        marker: {
          symbol: 'circle'
        },
        data: data
      }],
      size: {
        height: 320
      }
    };
  };

  return service;

}]);
