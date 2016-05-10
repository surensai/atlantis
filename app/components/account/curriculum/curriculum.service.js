'use strict';

angular.module('app').factory('CurriculumService', ['$http', '$rootScope', "_", function ($http, $rootScope, _) {

  var service = {};
  var base_url = $rootScope.base_url;
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";


  service.listWordsApi = function(user_id){
    return $http.get(base_url + '/private/'+ user_id  +'/listuserwords');
  };

  service.searchWordApi = function(word){
    return $http.get(base_url + '/word/'+ userID  +'/searchWord/'+word);
  };

  service.saveWordApi = function (wordData) {
    return $http.post(base_url + '/private/' + userID + '/createword', wordData);
  };

  service.updateWordApi = function (wordID, word) {
    return $http.put(base_url + '/private/' + userID + '/edituserword/' + wordID , word);
  };

  service.deleteWordApi = function (id) {
    return $http.delete(base_url + '/private/' + userID + '/deleteuserword/' + id);
  };

  service.getWordById = function(id){
    return $http.get(base_url + '/private/' + userID + '/getuserword/' +id);
  };

  service.getGroupWords = function(category){
    return $http.get(base_url +'/word/' + userID + '/searchCategory/' +category);
  };

  service.updateGroupWordsApi = function(words){
    return $http.post(base_url + '/wordsettings/'+userID+'/wordsettings', words );
  };

  service.uploadFileApi = function (file) {
    var fd = new FormData();
    fd.append('content', file);
    return $http.post(base_url + '/file/uploads3',fd,{
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    });
  };

  service.getObjById = function(data, id) {
    var obj = {};
    _.each(data, function(item){
      if( item.id === id ){
        obj = item;
      }
    });
    return obj;
  };



  return service;


}]);
