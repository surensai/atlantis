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
      if (sourceData[ind]._id.toLowerCase() === letter.toLowerCase()) {
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
          _id: letters[ind],
          repeatedTimes: 0,
          lastAttemptedOn: 0,
          value: {
            LatestRepeatedTime: 0,
            repeatedTimes: 0
          }
        };
        resultArr.push(emptyObj);
      }
    }
    return resultArr.concat(sourceArr);
  };

  //Get Graph Data
  service.getChartDetaisService = function (badgeId, playerId, chartType) {
    return $http.get(base_url + '/biggraphs/' + badgeId + "/" + playerId + "/" + chartType);
  };
  return service;


}]);

/*
 * Get Players Graph data points
 * */
angular.module('app').factory('PlayerGraphService', [function () {
  var graphObj = {};
  graphObj.getChartObj = function (formatedChartData, playerName, chartIndx) {
    var chartObj = {
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
        dateTimeLabelFormats: {
          day: '%a'
          //    month: '%e. %b',
          //     year: '%b'
        },
        /*labels: {
         formatter: function () {
         return moment(this.value).format("MM/DD/YYYY");
         }
         },*/
        startOnTick: true,
        endOnTick: true
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
      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },
      series: [{
        name: playerName + " Progress",
        color: '#4CBC96',
        marker: {
          symbol: 'circle'
        },
        data: [
          [Date.UTC(2016, 0, 4, 0, 0), 1],
          [Date.UTC(2016, 0, 4, 9, 0), 1],
          [Date.UTC(2016, 0, 4, 10, 30), 2],
          [Date.UTC(2016, 0, 5, 13, 0), 3],
          [Date.UTC(2016, 0, 5, 19, 0), 4],
          [Date.UTC(2016, 0, 7, 15, 0), 3],
          [Date.UTC(2016, 0, 7, 15, 25), 2],
          [Date.UTC(2016, 0, 8, 0, 0), null],
          [Date.UTC(2016, 0, 9, 0, 0), null],
          [Date.UTC(2016, 0, 10, 0, 0), null]
        ]
      }],
      size: {
        height: 320
      }
    };
    //update the chart type as per selected tab
    /*if (chartIndx === 0) {
     //Week Chart type
     delete chartObj.xAxis.labels;
     } else if (chartIndx === 1) {
     //month Chart type
     delete chartObj.xAxis.dateTimeLabelFormats;
     } else {

     }*/
    return chartObj;
  };
  return graphObj;
}]);

