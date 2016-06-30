'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService', 'messagesFactory', '$state', '$stateParams', '$rootScope', 'AuthenticationService', 'appService', '$uibModal', 'StaticService', 'UserService', function (DashboardService, messagesFactory, $state, $stateParams, $rootScope, authService, appService, $uibModal, StaticService, UserService) {
  var dashboard = this;
  var welcomefeed = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.welcomefeed : {};
  dashboard.userName = $rootScope.globals.currentUser;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = {};
  dashboard.data.newsFeeds = {};
  dashboard.data.termsCondtnPrcyPolcy = {terms: 'terms', privacy: 'privacy'};
  dashboard.isUserFirstTimeLoggedIn = false;
  dashboard.showWelcomeNewsFeedDetails = false;
  dashboard.hideWelcomeFeedOnload = true;

  function getTermsNCondtionData() {
    StaticService.getTermsAPI()
      .success(function (data) {
        openTermsNCondtonPrivacyPolicyPopup(data, false);
      }).error(function () {
    });
  }

  function getPrivacyPolicyData() {
    StaticService.getPrivacyAPI()
      .success(function (data) {
        openTermsNCondtonPrivacyPolicyPopup(data, true);
      }).error(function () {
    });
  }

  function updateTermsConditionPrivacyPolicy(type, version) {
    var bodyVer = {version: version};
    UserService.updateTermsConditionPrivacyPolicy($rootScope.globals.currentUser.id, type, bodyVer)
      .success(function (data) {
        if (type === dashboard.data.termsCondtnPrcyPolcy.terms) {
          $rootScope.globals.currentUser.terms = false;
          appService.updateCookieStore();
        } else {
          $rootScope.globals.currentUser.privacy = false;
          appService.updateCookieStore();
        }
      }).error(function (error, status) {
      messagesFactory.dashboardTermsConditionPrivacyPolicyError(status);
    });

  }

  function openTermsNCondtonPrivacyPolicyPopup(data, isPrivacyPolicy) {
    $uibModal.open({
      backdrop: 'static',
      keyboard: false,
      templateUrl: 'components/user/register/terms-agree-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.modalTitle = data.title;
        $scope.OKBtnLabel = "Agree";
        $scope.isExternalHtmlDataLoaded = false;
        $scope.fullHtmlViewURL = data.htmlView;
        $scope.ok = function () {
          if ($rootScope.globals.currentUser.privacy && !isPrivacyPolicy) {
            updateTermsConditionPrivacyPolicy(dashboard.data.termsCondtnPrcyPolcy.terms, data.version);
            getPrivacyPolicyData(); 
          } else {
            updateTermsConditionPrivacyPolicy(dashboard.data.termsCondtnPrcyPolcy.privacy, data.version);
          }
          $uibModalInstance.close();
        };
        $scope.cancel = function () {
          appService.removeSession();
          $state.go('login');
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });
  }

  (function () {
    loadFeedData();
    //load terms & condition or privacy policy popup
    if ($rootScope.globals.currentUser.terms) {
      getTermsNCondtionData();
    } else if ($rootScope.globals.currentUser.privacy) {
      getPrivacyPolicyData();
    }
  })();

  dashboard.showWelcomeMessageDetail = function () {
    appService.isFooterFixed();
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
