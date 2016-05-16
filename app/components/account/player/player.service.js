'use strict';

angular.module('app').factory('PlayerService', ['$http', '$rootScope', "_", function ($http, $rootScope, _) {

  var service = {};
  var base_url = $rootScope.base_url;
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";
  var playersData = [];

  service.getAllApi = function (user_id) {
    return $http.get(base_url + '/user/' + user_id + '/child');
  };

  service.getWordsApi = function (childId) {
    return $http.get(base_url + '/activity/' + userID + '/' + childId);
  };
  //Get Letters API
  service.getLettersWordsApi = function (childId) {
    return $http.get(base_url + '/word/' + childId + "/singleletterwords");
  };
//Get Nonsense Words API
  service.getNonsenseWordsApi = function (childId) {
    return $http.get(base_url + '/word/' + childId + "/nonsensewords");
  };
//Get Real Words API
  service.getRealWordsApi = function (childId) {
    return $http.get(base_url + '/word/' + childId + "/realwords");
  };
  service.getMinibadgesApi = function (playerId) {
    return $http.get(base_url + '/activity/' + userID + '/' + playerId + '/minibadges');
  };

  service.getPlayerHighlightsApi = function (playerId) {
    return $http.get(base_url + '/activity/' + userID + '/' + playerId + '/highlights');
  };

  service.searchWordApi = function (childId) {
    return $http.get(base_url + '/activity/' + userID + '/' + childId);
  };

  service.createApi = function (child) {
    return $http.post(base_url + '/user/' + userID + '/student', child);
  };

  service.deleteApi = function (id) {
    return $http.delete(base_url + '/user/' + userID + '/student/' + id);
  };

  service.updateApi = function (childID, child) {
    return $http.put(base_url + '/user/' + userID + '/student/' + childID + '/edit', child);
  };

  service.saveWordApi = function (wordData) {
    return $http.post(base_url + '/private/' + userID + '/createword', wordData);
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
    return $http.get(base_url + '/user/' + userID + '/child/' + id);
  };

  service.removeItem = function (data, obj) {
    data.splice(data.indexOf(obj), 1);
  };

  service.getBadges = function (userID, childID) {
    return $http.get(base_url + '/activity/' + userID + '/' + childID + '/bigbadges');
  };

  service.getAvatarsAPI = function (userID) {
    return $http.get(base_url + '/avatar/' + userID + '/get-avatars');
  };

  //Get Graph Data
  service.getChartDetaisService = function (badgeId, playerId, chartType) {
    return $http.get(base_url + '/sendbigbadgegraphs/' + badgeId + "/" + playerId + "/" + chartType);
  };
  return service;


}]);
