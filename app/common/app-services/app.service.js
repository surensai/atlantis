'use strict';

angular.module('app').factory('appService', [ '$rootScope','$timeout', function ( $rootScope, $timeout) {
  var service = {};

  service.handleOffline = function(uibModal, state, apiError){
    if(apiError){
      updateOnlineStatus();
      return false;
    }
    function updateOnlineStatus() {
      var condition = navigator.onLine ? "online" : "offline";
      if(condition === "offline" || apiError){
        var mInstance = uibModal.open({
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



  return service;

}]);
