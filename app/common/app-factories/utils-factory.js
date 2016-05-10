'use strict';
angular.module('app').factory('utilsFactory', [function () {

  var factory = {};

  factory.chunkArray = function(arr, size){
    var newArr = [];
    size = arr.length / 4;
    size = Math.ceil(size);
    for (var i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  };

  return factory;

}]);
