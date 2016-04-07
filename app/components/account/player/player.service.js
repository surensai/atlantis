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

  service.getBadges = function () {
    return [
      {
        milestone: 'Apple',
        percentage: '120%',
        type: 'active',
        image: 'apple'
      }, {
        milestone: 'Up',
        percentage: '100%',
        type: 'disabled',
        image: 'up'
      }, {
        milestone: 'Cat',
        percentage: '80%',
        type: 'disabled',
        image: 'cat'
      }, {
        milestone: 'Sight',
        percentage: '120%',
        type: 'disabled',
        image: 'sight'
      }, {
        milestone: 'Pancake',
        percentage: '115%',
        type: 'disabled',
        image: 'pancake'
      }, {
        milestone: 'Fish',
        percentage: '90%',
        type: 'disabled',
        image: 'fish'
      }, {
        milestone: 'Brick',
        percentage: '50%',
        type: 'disabled',
        image: 'brick'
      }, {
        milestone: 'Floss',
        percentage: '0%',
        type: 'disabled',
        image: 'floss'
      }, {
        milestone: 'Bee',
        percentage: '0%',
        type: 'disabled',
        image: 'bee'
      }, {
        milestone: 'Sky',
        percentage: '0%',
        type: 'disabled',
        image: 'sky'
      }, {
        milestone: 'Car',
        percentage: '0%',
        type: 'disabled',
        image: 'car'
      }, {
        milestone: 'Light',
        percentage: '0%',
        type: 'disabled',
        image: 'light'
      }, {
        milestone: 'Bear',
        percentage: '0%',
        type: 'disabled',
        image: 'bear'
      }, {
        milestone: 'House',
        percentage: '0%',
        type: 'disabled',
        image: 'house'
      }, {
        milestone: 'Swan',
        percentage: '0%',
        type: 'disabled',
        image: 'swan'
      }];
  };

  return service;


}]);
