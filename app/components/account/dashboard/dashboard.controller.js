'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService', 'messagesFactory', '$state', '$stateParams','$rootScope', function (DashboardService, messagesFactory, $state, $stateParams, $rootScope) {
  var dashboard = this;
  var welcomefeed = $rootScope.globals.currentUser.welcomefeed;
  dashboard.userName = $rootScope.globals.currentUser;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = {};
  dashboard.data.newsFeeds = {};

  dashboard.isUserFirstTimeLoggedIn = false;
  dashboard.showWelcomeNewsFeedDetails = false;
  (function () {
    if(welcomefeed && welcomefeed > 0){
      dashboard.isUserFirstTimeLoggedIn = true;
    } else {
      dashboard.isUserFirstTimeLoggedIn = false;
    }
    var handleSuccess = function (data) {
      if ($stateParams.id) {
        var tempArr = [];
        for (var i = 0; i < data.length; i++) {
          if ($stateParams.id === data[i].id) {
            tempArr.push(data[i]);
            dashboard.data.newsFeedsList = tempArr;
            break;
          }
        }
      } else {
        //filter the news feed based on status param
        dashboard.data.newsFeedsList = parseNewsFeedData(data);
      }

      dashboard.viewby = 10;
      dashboard.totalItems = dashboard.data.newsFeedsList.length;
      dashboard.currentPage = 1;
      dashboard.itemsPerPage = dashboard.viewby;
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.dashboardfeedsError(status);
      }
    };

    DashboardService.getAllApi()
      .success(handleSuccess)
      .error(handleError);

  })();

  dashboard.showWelcomeMessageDetail = function(){
    if(dashboard.showWelcomeNewsFeedDetails){
      dashboard.showWelcomeNewsFeedDetails = false;
    } else {
      dashboard.showWelcomeNewsFeedDetails = true;
    }
  };

  function parseNewsFeedData(data) {
    var tempNewsFeedArr = [];
    for (var newsFeedCounter = 0; newsFeedCounter < data.length; newsFeedCounter++) {
      if (data[newsFeedCounter].status === 'PUBLISH') {
        tempNewsFeedArr.push(data[newsFeedCounter]);
      }
    }
    return tempNewsFeedArr;
  }

}]);
