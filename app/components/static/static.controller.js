'use strict';

angular.module("app").controller('staticCtrl', ['$state', 'StaticService', 'flashService', 'AuthenticationService', '$http', function ($state, StaticService, flashService, authService, $http) {

  var self = this;
  self.contentFrameURL = "";
  self.isDataLoaded = false;
  if ($state.current.name === "page.privacy-policy") {
    getPrivacyContent();
  } else if ($state.current.name === "page.terms-services") {
    getTemsContent();
  } else if ($state.current.name === "page.warrentyinfo") {
    getWarrentyContent();
  }

  function getWarrentyContent() {
    var handleSuccess = function (data) {
      self.isDataLoaded = true;
      self.contentFrameURL = data.htmlView;
    };

    var handleError = function () {
      if (status === 401) {
        authService.generateNewToken(function () {
          getWarrentyContent();
        });
      }
      else {
        flashService.showError($translate.instant('common.messages.error_getting_data'), false);
      }
    };
    self.isDataLoaded = false;
    StaticService.getwarrantyAPI()
      .success(handleSuccess)
      .error(handleError);
  }

  function getPrivacyContent() {
    var handleSuccess = function (data) {
      self.isDataLoaded = true;
      self.contentFrameURL = data.htmlView;
    };

    var handleError = function () {
      if (status === 401) {
        authService.generateNewToken(function () {
          getPrivacyContent();
        });
      }
      else {
        flashService.showError($translate.instant('common.messages.error_getting_data'), false);
      }
    };
    self.isDataLoaded = false;
    StaticService.getPrivacyAPI()
      .success(handleSuccess)
      .error(handleError);
  }

  function getTemsContent() {
    var handleSuccess = function (data) {
      self.isDataLoaded = true;
      self.contentFrameURL = data.htmlView;
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getTemsContent();
        });
      }
      else {
        flashService.showError($translate.instant('common.messages.error_getting_data'), false);
      }
    };
    self.isDataLoaded = false;
    StaticService.getTermsAPI()
      .success(handleSuccess)
      .error(handleError);

  }

}]);
