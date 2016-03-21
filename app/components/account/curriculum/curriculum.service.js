'use strict';

angular.module('app').factory('CurriculumService', ['$http', '$rootScope', "_", function ($http, $rootScope, _) {

  var service = {};
  var base_url = $rootScope.base_url;
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";


  service.listWordsApi = function(){
    return $http.get(base_url + '/private/'+ userID  +'/listuserwords');
  };

  service.searchWordApi = function(word){
    return $http.get(base_url + '/word/'+ userID  +'/searchWord/'+word);
  };


  service.saveWordApi = function (wordData) {
    return $http.post(base_url + '/private/' + userID + '/createword', wordData);
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
