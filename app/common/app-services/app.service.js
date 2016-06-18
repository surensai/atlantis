'use strict';

angular.module('app').factory('appService', [ '$rootScope','$timeout','$cookieStore','$localStorage', function ( $rootScope, $timeout, $cookieStore, $localStorage) {
  var service = {};

  service.handleOffline = function(uibModal, state, apiError){
    if(apiError){
      updateOnlineStatus();
      return false;
    }
    function updateOnlineStatus() {
      var condition = navigator.onLine ? "online" : "offline";
      if(condition === "offline" || apiError){
       uibModal.open({
          keyboard: false,
          templateUrl: 'common/app-directives/modal/offline-modal.html',
          controller: ['$scope', '$state','$uibModalInstance', function ($scope, $state, $uibModalInstance) {

            $scope.close = function () {
              $uibModalInstance.dismiss('cancel');
              $state.reload();
            };
          }]
        });
      } else {
        state.reload();
      }

    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  };

  service.checkSessionOnURLChange = function(){
    $rootScope.globals = ($cookieStore.get('globals')) ? $cookieStore.get('globals') : {};
    return ($rootScope.globals.currentUser) ? true : false;
  };

  service.onSessionRedirections = function(currentUrl){
    var restrictedURLS = ['/login', '/register', '/forgot-password',''];
    return (($.inArray(currentUrl, restrictedURLS) !== -1) && service.checkSessionOnURLChange()) ? true : false;
  };

  service.removeSession = function(){
    $cookieStore.remove('globals');
    $rootScope.globals = {};
    delete $localStorage.token;
  };

  service.isFooterFixed = function(){
    (function($) {
      $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
      };
    })(jQuery);

    $timeout(function() {
      $rootScope.isFooterFix = $('body').hasScrollBar();
    }, 200);
  };

  service.setEnvironment = function(type){
    if(type === 'dev'){
      return 'http://ec2-52-71-125-138.compute-1.amazonaws.com';
    } else if(type === "prod"){
      return 'http://ec2-52-203-16-188.compute-1.amazonaws.com';
    }
  };

  service.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };

  service.simpleSort = function(sourceArr, property, reverse){
    sourceArr.sort(function (a, b) {
      if(typeof a[property] === "string"){
        if (a[property].toLowerCase() < b[property].toLowerCase()) {
          return -1;
        }
        if (a[property].toLowerCase() > b[property].toLowerCase()) {
          return 1;
        }
      } else {
        if (a[property] < b[property]) {
          return -1;
        }
        if (a[property] > b[property]) {
          return 1;
        }
      }
      return 0;
    });

    for (var i = 0; i < sourceArr.length; i++) {
      sourceArr[i][property];
    }

    if(reverse){
      sourceArr.reverse();
    }

    return sourceArr;
  };

  return service;

}]);
