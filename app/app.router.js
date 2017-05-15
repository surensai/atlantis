'use strict';
angular.module('app').run(['$rootScope', '$state', '$stateParams', '$location', '$cookieStore', '$http', '$localStorage', 'appService', '$timeout',
  function ($rootScope, $state, $stateParams, $location, $cookieStore, $http, $localStorage, appService, $timeout) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // You can set up the dev / prod
    $rootScope.base_url = appService.setEnvironment('dev');
    $rootScope.globals = $cookieStore.get('globals') || {};
    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {

    });
  }
]).config(['$stateProvider', '$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

  function urlBuilder(viewFolderPath, viewPath) {
    return 'components/' + viewFolderPath + '/' + viewPath + '.view.html';
  }
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: urlBuilder('home', 'home'),
    controller: 'homeCtrl',
    controllerAs: 'self',
    data: {
      pageTitle: 'Atlantis'
    }
  });
  $urlRouterProvider.otherwise('/home');
;


  //$locationProvider.html5Mode(true);

}]);
