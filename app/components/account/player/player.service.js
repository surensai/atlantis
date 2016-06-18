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

  function checkLetterDataAvailable(sourceData, letter){
    var letterAvailable = false;
    for(var ind = 0; ind < sourceData.length; ind++){
      if(sourceData[ind]._id.toLowerCase() === letter.toLowerCase()){
        letterAvailable = true;
        break;
      }
    }
    return letterAvailable;
  }

  service.addLetterIfNotExist = function(sourceArr){
    var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    var resultArr = [];
    for(var ind = 0; ind < letters.length; ind++){
      if(!checkLetterDataAvailable(sourceArr, letters[ind])){
        var emptyObj = {
          _id : letters[ind],
          repeatedTimes: 0,
          lastAttemptedOn: 0,
          value : {
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
    return $http.get(base_url + '/sendbigbadgegraphs/' + badgeId + "/" + playerId + "/" + chartType);
  };
  return service;


}]);

/*
 * Get Players Graph data points
 * */
angular.module('app').factory('PlayerGraphService', [function () {
  var graphObj = {};
  graphObj.getChartObj = function (formatedChartData, getXAxisLblRotation) {
    var chartObj = {
      options: {
        exporting: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        title: {
          text: ''
        },
        tooltip: {
          valueSuffix: '%'
        },
        chart: {
          zoomType: 'x',
          backgroundColor: 'rgba(255, 255, 255, 0)'
        },
        rangeSelector: {
          enabled: false
        },
        navigator: {
          xAxis: {
            labels: {
              formatter: function () {
                return moment(this.value).format("MM/DD");
              }
            }
          },
          enabled: true
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
      xAxis: {
        title: {
          text: "<b>Dates</b>"
        },
        labels: {
          formatter: function () {
            return moment(this.value).format("MM/DD/YYYY");
          }
        }
      },
      series: [{
        name: "Progress",
        color: '#4CBC96',
        marker: {
          symbol: 'circle'
        },
        data: [
          [1463587800000, 1],
          [1463589360000, 2],
          [1463591040000, 2],
          [1463592960000, 2],
          [1463593500000, 3],
          [1463593560000, 2],
          [1463593800000, 2],
          [1463593980000, 2],
          [1463595720000, 2],
          [1463595780000, 2],
          [1463595840000, 1],
          [1463595900000, 2],
          [1463595960000, 3],
          [1463596080000, 2],
          [1463596560000, 2],
          [1463596740000, 2],
          [1463597820000, 1],
          [1463598360000, 1],
          [1463599020000, 1],
          [1463599740000, 2],
          [1463599800000, 3],
          [1463599980000, 3],
          [1463600040000, 2],
          [1463600220000, 2],
          [1463600460000, 1],
          [1463603700000, 2],
          [1463603880000, 1],
          [1463609220000, 1],
          [1463609280000, 2],
          [1463690760000, 1],
          [1463726760000, 5],
          [1463726820000, 1],
          [1463727600000, 2],
          [1463728140000, 1],
          [1464023400000, 1],
          [1464023700000, 2],
          [1464023940000, 1],
          [1464024120000, 1],
          [1464024300000, 2],
          [1464024780000, 2],
          [1464024960000, 2],
          [1464025080000, 1],
          [1464025200000, 2],
          [1464025260000, 2],
          [1464025320000, 4],
          [1464025500000, 2],
          [1464025620000, 5],
          [1464025680000, 1],
          [1464025740000, 2],
          [1464025800000, 2],
          [1464026340000, 1],
          [1464068100000, 1],
          [1464071640000, 1],
          [1464074160000, 1],
          [1464074220000, 1],
          [1464083940000, 39],
          [1464094020000, 4],
          [1464094080000, 1],
          [1464094200000, 1],
          [1464094320000, 2],
          [1464094740000, 2],
          [1464094920000, 9],
          [1464095100000, 1],
          [1464095460000, 1],
          [1464095940000, 2],
          [1464097020000, 1],
          [1464112080000, 2],
          [1464112140000, 2],
          [1464115380000, 2],
          [1464115500000, 2],
          [1464115560000, 2],
          [1464116040000, 3],
          [1464116100000, 1],
          [1464116280000, 2],
          [1464116580000, 2],
          [1464116700000, 2],
          [1464116820000, 2],
          [1464117300000, 2],
          [1464117360000, 2],
          [1464117420000, 1],
          [1464117660000, 1],
          [1464117720000, 3],
          [1464126540000, 2],
          [1464126600000, 1],
          [1464126660000, 2],
          [1464126720000, 2],
          [1464126780000, 3],
          [1464126840000, 1],
          [1464127200000, 1],
          [1464157380000, 1],
          [1464157440000, 1],
          [1464198960000, 2],
          [1464203100000, 2],
          [1464218520000, 1],
          [1464222240000, 1],
          [1464222480000, 1],
          [1464229500000, 2],
          [1464290940000, 2],
          [1464291000000, 1],
          [1464291120000, 1],
          [1464293220000, 2],
          [1464296340000, 2],
          [1464296880000, 2],
          [1464299580000, 2],
          [1464303900000, 2],
          [1464309660000, 2],
          [1464309720000, 2],
          [1464310140000, 1],
          [1464343980000, 1],
          [1464344040000, 1],
          [1464344100000, 1],
          [1464344640000, 2],
          [1464375480000, 1],
          [1464376800000, 1],
          [1464376860000, 3],
          [1464377580000, 4],
          [1464377820000, 1],
          [1464378180000, 1],
          [1464378360000, 1],
          [1464378780000, 1],
          [1464378900000, 1],
          [1464379380000, 1],
          [1464379500000, 2],
          [1464379920000, 1],
          [1464380760000, 1],
          [1464385380000, 2],
          [1464385440000, 2],
          [1464385500000, 1],
          [1464386280000, 1],
          [1464386460000, 2],
          [1464386520000, 2],
          [1464386580000, 2],
          [1464388800000, 1],
          [1464388860000, 1],
          [1464390660000, 1],
          [1464390780000, 1],
          [1464391080000, 2],
          [1464391140000, 1],
          [1464391200000, 1],
          [1464391680000, 1],
          [1464392340000, 1],
          [1464393120000, 1],
          [1464393180000, 1],
          [1464393240000, 1],
          [1464393300000, 1],
          [1464467880000, 3],
          [1464467940000, 3],
          [1464607140000, 1],
          [1464608040000, 2],
          [1464608520000, 1],
          [1464608580000, 1],
          [1464678000000, 1],
          [1464689820000, 1],
          [1464697560000, 1],
          [1464698340000, 1],
          [1464698400000, 2],
          [1464704760000, 3],
          [1464717540000, 1],
          [1464720960000, 1],
          [1464721200000, 1],
          [1464724260000, 1],
          [1464724320000, 1],
          [1464724380000, 1],
          [1464724440000, 1],
          [1464724500000, 1],
          [1464724560000, 2],
          [1464724680000, 1],
          [1464724740000, 1],
          [1464724800000, 1],
          [1464724860000, 1],
          [1464724920000, 2],
          [1464724980000, 1],
          [1464725040000, 1],
          [1464725100000, 1],
          [1464725220000, 2],
          [1464725340000, 1],
          [1464725460000, 1],
          [1464725520000, 1],
          [1464725580000, 1],
          [1464725640000, 2],
          [1464725700000, 1],
          [1464725760000, 1],
          [1464725820000, 2],
          [1464725880000, 1],
          [1464725940000, 2],
          [1464726000000, 1],
          [1464726060000, 1],
          [1464726120000, 1],
          [1464726180000, 1],
          [1464726240000, 1],
          [1464726300000, 1],
          [1464726420000, 1],
          [1464726480000, 1],
          [1464740280000, 1],
          [1464740340000, 2],
          [1464740400000, 2],
          [1464740580000, 1],
          [1464740760000, 1],
          [1464741180000, 1],
          [1464741300000, 3],
          [1464741600000, 2],
          [1464741660000, 1],
          [1464741720000, 2],
          [1464743940000, 1],
          [1464744000000, 1],
          [1464744240000, 1],
          [1464744300000, 2],
          [1464744360000, 1],
          [1464744420000, 3],
          [1464744480000, 1],
          [1464744600000, 2],
          [1464744660000, 2],
          [1464744720000, 1],
          [1464744780000, 1],
          [1464744840000, 1],
          [1464745020000, 1],
          [1464745260000, 1],
          [1464745320000, 1],
          [1464745380000, 1],
          [1464745500000, 1],
          [1464745620000, 1],
          [1464745680000, 2],
          [1464745740000, 1],
          [1464745800000, 2],
          [1464745860000, 1],
          [1464745920000, 1],
          [1464746040000, 1],
          [1464746100000, 1],
          [1464746220000, 1],
          [1464746400000, 1],
          [1464746520000, 2],
          [1464746580000, 1],
          [1464746640000, 1],
          [1464746760000, 1],
          [1464747540000, 1],
          [1464764640000, 1],
          [1464773340000, 1],
          [1464779820000, 1],
          [1464779940000, 1],
          [1464780060000, 1],
          [1464780360000, 1],
          [1464780420000, 1],
          [1464807240000, 1],
          [1464807300000, 1],
          [1464807360000, 1],
          [1464807420000, 1],
          [1464810240000, 1],
          [1464810300000, 1],
          [1464810360000, 1],
          [1464810420000, 1],
          [1464810480000, 1],
          [1464810600000, 1],
          [1464810660000, 1],
          [1464810720000, 2],
          [1464810780000, 1],
          [1464810840000, 1],
          [1464810960000, 1],
          [1464811020000, 1],
          [1464811080000, 1],
          [1464811140000, 1],
          [1464811200000, 1],
          [1464811320000, 1],
          [1464811380000, 1],
          [1464811440000, 1],
          [1464811500000, 1],
          [1464811560000, 2],
          [1464811680000, 1],
          [1464811740000, 1],
          [1464811920000, 1],
          [1464811980000, 3],
          [1464812100000, 3],
          [1464812160000, 1],
          [1464812220000, 2],
          [1464812340000, 3],
          [1464812400000, 1],
          [1464812460000, 1],
          [1464812520000, 1],
          [1464812580000, 2],
          [1464818040000, 1],
          [1464818100000, 1],
          [1464818160000, 1],
          [1464859020000, 1],
          [1464863640000, 1],
          [1464863820000, 1],
          [1464890280000, 2],
          [1464890520000, 1],
          [1464903960000, 1],
          [1464904020000, 1],
          [1464904260000, 1],
          [1464909300000, 1],
          [1464909900000, 3],
          [1464909960000, 2],
          [1464910020000, 2],
          [1464910080000, 1],
          [1464910140000, 1],
          [1464987540000, 1],
          [1464992520000, 2],
          [1464992580000, 1],
          [1464992700000, 1],
          [1464993600000, 1],
          [1464993660000, 1],
          [1464993720000, 1],
          [1465083840000, 2],
          [1465199820000, 1],
          [1465199880000, 1],
          [1465199940000, 1],
          [1465200000000, 1],
          [1465205400000, 1],
          [1465205460000, 1],
          [1465205520000, 1],
          [1465205640000, 1],
          [1465206420000, 1],
          [1465206480000, 1],
          [1465206840000, 1],
          [1465206960000, 1],
          [1465207080000, 2],
          [1465207380000, 2],
          [1465207440000, 1],
          [1465207500000, 2],
          [1465207560000, 1],
          [1465207800000, 1],
          [1465208220000, 2],
          [1465208340000, 1],
          [1465208400000, 1],
          [1465208760000, 2],
          [1465208820000, 1],
          [1465208880000, 2],
          [1465208940000, 1],
          [1465209000000, 1],
          [1465297200000, 1],
          [1465362900000, 2],
          [1465363140000, 1],
          [1465363200000, 1],
          [1465363860000, 1],
          [1465363980000, 1],
          [1465364040000, 4],
          [1465412100000, 1],
          [1465412160000, 1],
          [1465412220000, 1]]
      }],
      size: {
        height: 320
      },
      loading: false,
      useHighStocks: true
    };
    return chartObj;
  };
  return graphObj;
}]);

