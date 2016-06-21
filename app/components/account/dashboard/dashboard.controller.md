angular.module("app").controller('dashboardCtrl', ['DashboardService', 'messagesFactory', '$state', '$stateParams', '$rootScope', 'AuthenticationService','appService', function (DashboardService, messagesFactory, $state, $stateParams, $rootScope, authService, appService) {

    dashboard.showWelcomeMessageDetail = function () {
      ...
    }

}]);
