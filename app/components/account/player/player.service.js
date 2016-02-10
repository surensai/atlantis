'use strict';

angular.module('app').factory('PlayerService', ['$http', '$rootScope', "_", function ($http, $rootScope, _) {

  var service = {};
  var base_url = "http://ec2-54-159-195-71.compute-1.amazonaws.com";
  var userID = $rootScope.globals.currentUser.id;
  var fd = new FormData();

  service.getAllApi = function () {
    return $http.get(base_url + '/user/' + userID + '/child');
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

  service.uploadFileApi = function (file) {
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

  service.removeItem = function(data, obj){
    data.splice(data.indexOf(obj),1);
  };

  return service;


}]);
