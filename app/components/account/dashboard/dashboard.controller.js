'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService', 'messagesFactory', '$state', '$stateParams', '$rootScope', 'AuthenticationService', function (DashboardService, messagesFactory, $state, $stateParams, $rootScope, authService) {
  var dashboard = this;
  var welcomefeed = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.welcomefeed : {};
  dashboard.userName = $rootScope.globals.currentUser;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = {};
  dashboard.data.newsFeeds = {};

  dashboard.isUserFirstTimeLoggedIn = false;
  dashboard.showWelcomeNewsFeedDetails = false;
  dashboard.hideWelcomeFeedOnload = true;

  (function () {
    loadFeedData();
  })();

  dashboard.showWelcomeMessageDetail = function () {
    if (dashboard.showWelcomeNewsFeedDetails) {
      dashboard.showWelcomeNewsFeedDetails = false;
    } else {
      dashboard.showWelcomeNewsFeedDetails = true;
    }
  };

  function parseNewsFeedData(data) {
    var tempNewsFeedArr = [];
    for (var newsFeedCounter = 0; newsFeedCounter < data.length; newsFeedCounter++) {
      if (data[newsFeedCounter].status === 'PUBLISH') {
        data[newsFeedCounter].isImgLoaded = false;
        tempNewsFeedArr.push(data[newsFeedCounter]);
      }
    }
    tempNewsFeedArr = sortArrayByTime(tempNewsFeedArr);
    return tempNewsFeedArr;
  }

  function loadFeedData() {
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


      dashboard.currentPage = 1;
      dashboard.itemsPerPage = 10;
      dashboard.lastPage = Math.ceil(dashboard.data.newsFeedsList.length / dashboard.itemsPerPage);

      dashboard.hideWelcomeFeedOnload = false;

      if (welcomefeed && welcomefeed > 0) {
        dashboard.isUserFirstTimeLoggedIn = true;
      } else {
        dashboard.isUserFirstTimeLoggedIn = false;
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          loadFeedData();
        });
      }
      else {
        messagesFactory.dashboardfeedsError(status);
      }
    };

    DashboardService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  }

  //sort news feed
  function sortArrayByTime(arrObj) {
    if (arrObj && arrObj.length > 0) {
      arrObj = _.sortBy(arrObj, "updatedAt");
      arrObj.reverse();
      return arrObj;
    } else {
      return [];
    }
  }

}]);
